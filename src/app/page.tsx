"use client";

import { gql } from "@apollo/client";
import { ApolloProvider, useQuery } from "@apollo/client/react";
import client from "../../lib/apolloClient";
import { GetCountriesData } from "../../lib/types";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
    }
  }
`;

function CountriesList() {
  const { loading, error, data } = useQuery<GetCountriesData>(GET_COUNTRIES);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.countries.map((country) => (
        <li key={country.code}>
          {country.emoji} {country.name} ({country.code})
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <ApolloProvider client={client}>
      <h1>Countries List</h1>
      <CountriesList />
    </ApolloProvider>
  );
}
