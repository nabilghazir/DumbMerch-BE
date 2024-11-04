import * as categoryRepositories from "../repositories/category-repo";


export const getAllCategory = async () => {
    return categoryRepositories.getAllCategory()
}

export const getCategory = async (id: number) => {
    return categoryRepositories.getCategory(id)
}

export const getCategoryByName = async (categoryName: string) => {
    const category = await categoryRepositories.findCategoryByName(categoryName);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};

export const createCategory = async (name: string) => {
    return categoryRepositories.createCategory(name)
}

export const updateCategory = async (id: number, name: string) => {
    return categoryRepositories.updateCategory(id, name)
}

export const deleteCategory = async (id: number) => {
    return categoryRepositories.deleteCategory(id)
}