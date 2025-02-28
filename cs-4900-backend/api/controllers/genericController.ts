import pkg from 'express';

export const createGenericController = <T>(service: any, entity: string) => {
    const serviceInstance = new service();

    return {
        getAll: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            try {
                const items: T[] = await serviceInstance.getAll();
                res.json(items);
            } catch (err) {
                res.status(500).json({ error: `Error retrieving ${entity}s: ${err}` });
            }
        },

        getById: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            try {
                const item: T | null = await serviceInstance.getById(req.params[`${entity}Id`]);
                if (!item) return res.status(404).json({ error: `${entity} not found` });
                res.json(item);
            } catch (err) {
                res.status(500).json({ error: `Error retrieving ${entity}: ${err}` });
            }
        },

        getBySlugOrId: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            const { slugOrId } = req.params;
            try {
                let item = await serviceInstance.getBySlug(slugOrId);

                if (!item) {
                    item = await serviceInstance.getById(slugOrId);
                }
                if (!item) {
                    return res.status(404).json({ error: `${entity} not found` });
                }
                res.json(item);

            } catch (err) {
                res.status(500).json({ error: `Error retrieving ${entity}: ${err}` });
            }
        },

        getByName: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            try {
                const item: T | null = await serviceInstance.getByName(req.params.name);
                if (!item) return res.status(404).json({ error: `${entity} not found`});
                res.json(item);
            } catch (err) {
                res.status(500).json({ error: `Error retrieving ${entity}: ${err}` });
            }
        },

        create: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            try {
                // The generic controller should be able to handle artist and album ids
                // This accounts for the unique creates for songs and albums
                const data = req.body;
                const artistIds = req.body.artist_ids || [];
                const albumIds = req.body.album_ids || [];
                const newItem: T = await serviceInstance.create(data, artistIds, albumIds);
                res.status(201).json(newItem);
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: `Error creating ${entity}: ${err}` });
            }
        },

        update: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            try {
                const updatedItem: T | null = await serviceInstance.update(req.params[`${entity}Id`], req.body);
                if (!updatedItem) return res.status(404).json({ error: `${entity} not found` });
                res.json(updatedItem);
            } catch (err) {
                res.status(500).json({ error: `Error updating ${entity}: ${err}` });
            }
        },

        delete: async (req: pkg.Request, res: pkg.Response): Promise<any> => {
            try {
                const deleted = await serviceInstance.delete(req.params[`${entity}Id`]);
                if (!deleted) return res.status(404).json({ error: `${entity} not found` });
                res.json({ message: `${entity} deleted successfully` });
            } catch (err) {
                res.status(500).json({ error: `Error deleting ${entity}: ${err}` });
            }
        }
    };
};
