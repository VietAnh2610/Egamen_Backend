const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description, original_price } = newProduct;

    try {
      const checkProduct = await Product.findOne({ name: name });

      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product already exists",
        });
      }

      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        original_price,
      });

      if (createdProduct) {
        // Lấy danh sách sản phẩm hiện tại từ database (hoặc một nguồn dữ liệu khác)
        const productList = await Product.find();

        // Đưa sản phẩm mới được tạo vào đầu danh sách
        productList.unshift(createdProduct);

        resolve({
          status: "OK",
          message: "SUCCESS",
          data: productList,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Failed to create product",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProduct = (id, data) => {
  
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "the product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete Product SUCCESS ",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {};
      if (filter) {
        const label = filter[0];
        query[label] = { '$regex': filter[1], '$options': 'i' };
      }

      let productsQuery = Product.find(query).limit(limit).skip(limit * page);

      // Nếu có sắp xếp thì áp dụng sắp xếp, nếu không thì sắp xếp theo createdAt giảm dần
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        productsQuery = productsQuery.sort(objectSort);
      } else {
        productsQuery = productsQuery.sort({ createdAt: -1 }); // Sắp xếp theo createdAt giảm dần
      }

      const allProduct = await productsQuery;
      const totalProduct = await Product.countDocuments(query);

      resolve({
        status: "OK",
        message: "List product",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message
      });
    }
  });
};

// const getAllProduct = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const allProduct = await Product.find({
   
//       });
//       resolve({
//         status: "OK",
//         message: "SUCCESS",
//         data: allProduct,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "the product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = (limit, page, sort,filter) => {

  return new Promise(async (resolve, reject) => {
    try {
   
      const allType = await Product.distinct('type')
        
      resolve({
        status: "OK",
        message: "List type",
        data: allType,
     
      });
    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getDetailsProduct,
  getAllType
};
