import { ApolloClient, InMemoryCache } from '@apollo/client'

export const subgraphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-rinkeby',
  cache: new InMemoryCache(),
})
