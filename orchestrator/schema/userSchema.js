const { gql, UserInputError } = require("apollo-server");

const axios = require("axios");
const redis = require("../config/redisIo");
const baseUrlUser = "http://localhost:3000";

const typeDefs = gql`
  type User {
    fullName: String
    email: String
    password: String
    city: String
    profilePicture: String
    isVerified: Boolean
    verificationCode: String
    status: Boolean
  }
  type Massage {
    message: String
  }
  type Query {
    getUser(email: String, password: String): [User]
  }
  type Mutation {
    addUser(
      fullName: String
      email: String
      password: String
      city: String
      profilePicture: String
    ): User
  }
`;

const resolvers = {
  Query: {
    getUser: async (_, args) => {
      try {
        const { email, password } = args;
        const cache = await redis.get("user");
        let newChache = JSON.parse(cache);

        if (!newChache) {
          newChache[0] = { email: null };
        }
        if (newChache.email === email) {
          return newChache;
        } else {
          const { data } = await axios.get(
            `${baseUrlUser}/users?email=${email}&password=${password}`
          );
          await redis.set("user", JSON.stringify(data));
          return data;
        }
      } catch (error) {}
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      try {
        const { fullName, email, password, city, profilePicture } = args;
        const option = {
          fullName,
          email,
          password,
          city,
          profilePicture,
          isVerified: true,
          verificationCode: "4a596",
          status: false,
        };
        const { data } = await axios.post(`${baseUrlUser}/users`, option);
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
