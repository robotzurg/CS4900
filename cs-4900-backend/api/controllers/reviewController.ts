// import { ReviewService } from 'api/services/reviewService.ts';
// import pkg from 'express';

// export const createReviewController = <Review>() => {
//     const serviceInstance = new ReviewService();

//     return {
//         getAll: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
//             try {
//                 const items: T[] = await serviceInstance.getAll();
//                 res.json(items);
//             } catch (err) {
//                 res.status(500).json({ error: `Error retrieving reviews: ${err}` });
//             }
//         },

//         getById: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
//             try {
//                 const item: Review | null = await serviceInstance.getById(req.params[`reviewId`]);
//                 if (!item) return res.status(404).json({ error: `Review not found` });
//                 res.json(item);
//             } catch (err) {
//                 res.status(500).json({ error: `Error retrieving review: ${err}` });
//             }
//         },

//         getByName: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
//             try {
//                 const item: Review | null = await serviceInstance.getByName(req.params.name);
//                 if (!item) return res.status(404).json({ error: `Review not found`});
//                 res.json(item);
//             } catch (err) {
//                 res.status(500).json({ error: `Error retrieving review: ${err}` });
//             }
//         },

//         create: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
//             try {
//                 // The generic controller should be able to handle artist and album ids
//                 // This accounts for the unique creates for songs and albums
//                 const data = req.body;
//                 const newItem: T = await serviceInstance.create(data);
//                 res.status(201).json(newItem);
//             } catch (err) {
//                 console.log(err);
//                 res.status(500).json({ error: `Error creating ${entity}: ${err}` });
//             }
//         },

//         update: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
//             try {
//                 const updatedItem: T | null = await serviceInstance.update(req.params[`${entity}Id`], req.body);
//                 if (!updatedItem) return res.status(404).json({ error: `${entity} not found` });
//                 res.json(updatedItem);
//             } catch (err) {
//                 res.status(500).json({ error: `Error updating ${entity}: ${err}` });
//             }
//         },

//         delete: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
//             try {
//                 const deleted = await serviceInstance.delete(req.params[`${entity}Id`]);
//                 if (!deleted) return res.status(404).json({ error: `${entity} not found` });
//                 res.json({ message: `${entity} deleted successfully` });
//             } catch (err) {
//                 res.status(500).json({ error: `Error deleting ${entity}: ${err}` });
//             }
//         }
//     };
// };
