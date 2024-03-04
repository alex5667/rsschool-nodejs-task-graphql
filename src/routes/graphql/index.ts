import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { queries } from './queriesTypes.js';
import { FastifyRequest } from 'fastify';
import { mutations } from './mutationTypes.js';
import depthLimit from 'graphql-depth-limit';
interface RequestBody {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: Record<string, any>;
}
const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req: FastifyRequest) {
      const body = req.body as RequestBody;
      const { query, variables } = body;

      const queriesSchema = new GraphQLSchema({
        query: queries,
        mutation: mutations,
      });
      const errors = validate(queriesSchema, parse(query), [depthLimit(5)]);

      const res = await graphql({
        schema: queriesSchema,
        source: query,
        contextValue: fastify,
        variableValues: variables,
      });
      return errors.length ? { errors } : res;
    },
  });
};

export default plugin;
