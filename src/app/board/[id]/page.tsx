"use client";
import { useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function SimpleDnD() {
  const [lists, setLists] = useState<Record<string, string[]>>({
    todo: ["Task A", "Task B"],
    inprogress: ["Task C"],
    done: ["Task D"],
  });

  const [listOrder, setListOrder] = useState<string[]>([
    "todo",
    "inprogress",
    "done",
  ]);

  // Refs object to hold input refs keyed by listId
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function handleDragEnd(result: DropResult) {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const updatedOrder = Array.from(listOrder);
      const [moved] = updatedOrder.splice(source.index, 1);
      updatedOrder.splice(destination.index, 0, moved);
      setListOrder(updatedOrder);
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(lists[source.droppableId]);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setLists((prev) => ({ ...prev, [source.droppableId]: items }));
    } else {
      const sourceItems = Array.from(lists[source.droppableId]);
      const destItems = Array.from(lists[destination.droppableId]);
      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);
      setLists((prev) => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      }));
    }
  }

  return (
    <>
      <div className="main-container">
        <div className="DropDown">
          <select id="options">
            <option value="Delivered">Delivered</option>
            <option value="todo">Todo</option>
          </select>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                className="lists-container"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {listOrder.map((listId, index) => (
                  <Draggable draggableId={listId} index={index} key={listId}>
                    {(provided) => (
                      <div
                        className="list-wrapper"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Droppable droppableId={listId} key={listId}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="droppable"
                            >
                              <h3>{listId.toUpperCase()}</h3>
                              {lists[listId].map((item, index) => (
                                <Draggable
                                  key={`${item}-${index}`}
                                  draggableId={`${item}-${index}`}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="draggable"
                                    >
                                      {item}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {/* Input and button per list */}
                        <input
                          type="text"
                          placeholder={`Add to ${listId}`}
                          ref={(el) => {
                            inputRefs.current[listId] = el;
                          }}
                        />
                        <button
                          onClick={() => {
                            const val = inputRefs.current[listId]?.value.trim() || "";
                            if (!val) return;
                            setLists((prev) => ({
                              ...prev,
                              [listId]: [...prev[listId], val],
                            }));
                            if (inputRefs.current[listId])
                              inputRefs.current[listId]!.value = "";
                          }}
                        >
                          Add Pulse
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}
