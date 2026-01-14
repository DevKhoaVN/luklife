// import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
// 
// export const productApi= createApi({
//     reducerPath: 'productApi',
//     baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/v1'}), // base url
//     endpoints: (builder) => ({
//         getWhiteListProduct: builder.query({
//            query: (limit = 10, type = 'whitelist') => `/products?type=${type}&limit=${limit}`,
//         }),
//         getOnlineExclusiveOffer: builder.query({
//               query: (limit = 10, type = 'deal') => `/products?type=${type}&limit=${limit}`,
//         }),
//         getSaleProduct: builder.query({
//               query: (limit = 10, type = 'hot') => `/products?type=${type}&limit=${limit}`,
//         }),
//         getProductsByCategory: builder.query({
//             query: ({slug, page = 1, limit = 30, sort = 'newest'}) => {
//                  const params = new URLSearchParams({
// 
//                     category_slugs: slug,
//                     page: page.toString(),
//                     limit: limit.toString(),
//                     sort,
//                  })
//                  return `/products/${params}`
//             }
//         }),
//          getProductBySlug: builder.query({
//            query: (slug) => `/products/${slug}`,
//         }),
//     })
// })
// 
// export const {
//     useGetWhiteListProductQuery,
//     useGetOnlineExclusiveOfferQuery,
//     useGetSaleProductQuery,
//     useGetProductBySlugQuery,
//     useGetProductsByCategoryQuery
// } = productApi