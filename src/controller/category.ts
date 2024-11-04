import * as categoryService from '../services/category'
import { Request, Response, NextFunction } from 'express'

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getAllCategory()
        res.json(categories)
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}

export const fetchCategory = async (req: Request, res: Response) => {
    try {
        const { categoryName } = req.params;

        const category = await categoryService.getCategoryByName(categoryName)
        res.json(category)
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.body.name
        const category = await categoryService.createCategory(name)
        res.json(category)
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id)
        const category = await categoryService.deleteCategory(id)
        res.json("Delete Success")
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id)
        const name = req.body.name
        const category = await categoryService.updateCategory(id, name)
        res.json({
            message: "Update Success",
            category
        })
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
}