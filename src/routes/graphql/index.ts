import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { queries } from './queriesTypes.js';
import { FastifyRequest } from 'fastify';
interface RequestBody {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>;
}
const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',

    async handler(req: FastifyRequest) {
      const body = req.body as RequestBody;
      const { query, variables } = body;

      const queriesSchema = new GraphQLSchema({
        query: queries,
      });
      const res = await graphql({
        schema: queriesSchema,
        source: String(query),
        contextValue: fastify,
        variableValues: variables,
      });
      return res;
    },
  });
};

export default plugin;
