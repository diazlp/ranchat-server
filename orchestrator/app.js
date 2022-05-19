const { ApolloServer } = require("apollo-server");
const userSchema = require("./schema/userSchema");

const server = new ApolloServer({
  typeDefs: [userSchema.typeDefs],
  resolvers: [userSchema.resolvers],
  introspection: true,
  playground: true,
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
