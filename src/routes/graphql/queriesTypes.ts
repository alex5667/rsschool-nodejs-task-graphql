import { GraphQLList, GraphQLObjectType } from 'graphql';
import { FastifyInstance } from 'fastify';
import { MemberType, MemberTypeId, Posts, Profiles, Users } from './types/models.js';
import { UUIDType } from './types/uuid.js';

export const queries = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(Users),
      resolve: async (_, args, { prisma}: FastifyInstance) => {return await prisma.user.findMany()} 
    },
    user: {
       type: Users,
       args: {id:{type: UUIDType}},
       resolve: async (_, args: { id: string}, { prisma}: FastifyInstance) => {
         const res = await prisma.user.findUnique({ where: {id: args.id}});
         return res || null;
       }
    },

    posts: {
      type: new GraphQLList(Posts),
      resolve: async (_, args, { prisma}: FastifyInstance) => await prisma.post.findMany ()
    },
    post: {
      type: Posts,
      args: {id:{type: UUIDType}},
      resolve: async (_, args: { id: string}, { prisma}: FastifyInstance) => {
        const res = await prisma.post.findUnique({ where: {id: args.id}});
        return res || null;
      }
    },

    profiles: {
      type: new GraphQLList(Profiles),
      resolve: async (_, args, { prisma}: FastifyInstance) => await prisma.profile. findMany()
    },
    profile: {
     type: Users,
     args: {id:{type: UUIDType}},
     resolve: async (_, args: { id: string}, { prisma}: FastifyInstance) => {
       const res = await prisma.profile.findUnique({ where: {id: args.id}});
       return res || null;
     }
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_, args, { prisma}: FastifyInstance) => await prisma. memberType.findMany()
    },
    memberType: {
      type: MemberType,
      args: {id: {type: MemberTypeId}},
      resolve: async (_, args: { id: string}, { prisma, httpErrors }: FastifyInstance) => {
        const res =  await prisma.memberType.findUnique({ where: {id: args.id}});
        if (!res) {
          throw httpErrors.notFound()
      }
        return res || null;
      }
     }
  }
})
