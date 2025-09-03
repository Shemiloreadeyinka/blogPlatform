const Category = require("../models/categoryModel")


exports.addCategory = async (req, res) => {
    let { name, description } = req.body
    name = name?.trim().toLowerCase()|| null
    try {
        if (!name) return res.status(400).json({ message: "Name of category required" })
        let category = await Category.findOne({ name})
        if (category) return res.status(400).json({ message: "Category already exists" })
        category = new Category({ name, description })
        await category.save()
        return res.status(201).json({ message: "category created successfully" })

    } catch (error) {
        return res.status(error.status||500).json({ error: error.message })
    }


}

exports.getCategory = async (req, res) => {
    let { categoryId } = req.params
    try {
        let category = await Category.findById(categoryId)
        if (!category) return res.status(404).json({ message: "category doesn't exist" })
        return res.status(200).json({ message: "category retrieved", category })
    } catch (error) {
        return res.status(error.status||500).json({ error: error.message })
    }

}

exports.getAllCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        return res.status(200).json({ message: "categories retrieved", categories })

    } catch (error) {
        return res.status(error.status||500).json({ error: error.message })

    }

}
exports.deleteCategory= async (req,res) => {
    let {categoryId} = req.params

    try {
        const deletedCategory= await Category.findByIdAndDelete(categoryId)
        if (!deletedCategory) return res.status(404).json({message: "category doesn't exist"})
        return res.status(200).json({message: "category successfully deleted", deletedCategory})
    } catch (error) {
        return res.status(error.status||500).json({ error: error.message })

    }
    
}

exports.updateCategory = async (req, res) => {
    let { categoryId } = req.params

    let { name, description, image } = req.body
        name = name?.trim().toLowerCase()


    try {
        const category = await Category.findById(categoryId)
        console.log(category)
        if (!category) return res.status(404).json({ message: "Category doesn't exist" })

        if (name) {
            const categoryName = await Category.findOne({ name })
            if (categoryName && categoryName._id.toString() !== category._id.toString()) {
                return res.status(400).json({ message: "Category with this new name already exists" })
            }
            category.name = name
        }

        if (description !== undefined) category.description = description

        await category.save()
        return res.status(200).json({ message: "Category updated successfully", category })

    } catch (error) {
        return res.status(error.status||500).json({ error: error.message })
    }
}