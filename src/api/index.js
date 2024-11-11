import { createApi } from "@reduxjs/toolkit/query/react";
import customApiHandler from "./customApiHandler";

export const api = createApi({
    reducerPath:'business',
    baseQuery:customApiHandler(),
    endpoints: () => ({})
})
