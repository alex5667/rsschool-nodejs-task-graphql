import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { FastifyInstance } from 'fastify';
import { Post, Profile, User } from '@prisma/client';

const Users: GraphQLObjectType = new GraphQLObjectType({
  name: 'users',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const queries = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(Users),

      resolve: async (_, args, { prisma }: FastifyInstance) => {
        return await prisma.user.findMany();
      },
    },
  },
});
