import {
  callHooks,
  getRelatedData,
  filterHiddenFields,
  serializeData,
  addForeignKeyQuery,
} from "./helpers.js";
import { HOOK_FUNCTIONS, HANDLERS } from "./../constants.js";
import QueryParser from "./../core/QueryParser.js";

export default async (context) => {
  const { request, response, model, models, trx, relation, parentModel } =
    context;

  const queryParser = new QueryParser({ model, models });

  // We should parse URL query string to use as condition in Lucid query
  const conditions = queryParser.get(request.query);

  // Creating a new database query
  const query = trx.from(model.instance.table);

  // Users should be able to select some fields to show.
  queryParser.applyFields(query, conditions.fields);

  // Binding parent id if there is.
  addForeignKeyQuery(request, query, relation, parentModel);

  await callHooks(model, HOOK_FUNCTIONS.onBeforePaginate, {
    ...context,
    conditions,
    query,
  });

  // Users should be able to filter records
  queryParser.applyWheres(query, conditions.q);

  // User should be able to select sorting fields and types
  queryParser.applySorting(query, conditions.sort);

  const result = await query.paginate({
    perPage: conditions.per_page,
    currentPage: conditions.page,
    isLengthAware: true,
  });

  // We should try to get related data if there is any
  await getRelatedData(
    result.data,
    conditions.with,
    model,
    models,
    trx,
    HANDLERS.PAGINATE,
    request
  );

  await callHooks(model, HOOK_FUNCTIONS.onAfterPaginate, {
    ...context,
    result,
    conditions,
    query,
  });

  // Serializing the data by the model's serialize method
  result.data = await serializeData(
    result.data,
    model.instance.serialize,
    HANDLERS.PAGINATE,
    request
  );

  // Filtering hidden fields from the response data.
  filterHiddenFields(result.data, model.instance.hiddens);

  return response.json(result);
};
