import 'graphql-import-node';
import { companyresolvers,companytypedef} from "./company/index.js";
import { jobresolvers,jobtypedef } from "./jobs/index.js";
import {usersresolvers,userstypedef} from './users/index.js'
import { makeExecutableSchema } from "@graphql-tools/schema";


const schema=makeExecutableSchema({
  typeDefs:[companytypedef,jobtypedef,userstypedef],
  resolvers:[companyresolvers,jobresolvers,usersresolvers]

})
export default schema