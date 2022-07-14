const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  Product.findAll({
    attributes: [
      'id',
      'product_name',
      'price',
      'stock',
    ],

    include: [
      {
        model: Category,
        attributes: ['category_name'],
      },
      {
        model: Tag,
        attributes: ['tag_name'],
      }
    ]
  })
    .then(productRow => res.json(productRow))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});


// get one product
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
     'id',
     'product_name',
     'price',
     'stock',
   ],
 
   include: [
     {
       model: Category,
       attributes: ['category_name'],
     },
     {
       model: Tag,
       attributes: ['tag_name'],
     }
   ]
  })
  .then(productRow => res.json(productRow))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
 });

// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      
      if (req.body.tag_ids.length) {
        const productTags = req.body.tag_ids.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        ProductTag.bulkCreate(productTags);
        return product
      }
      res.status(200).json(product);
    })
    .then((product) => res.status(200).json(product))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  })
  .then((productTags) => {
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tag_ids
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tag_ids.includes(tag_id))
      .map(({ id }) => id);
    Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    res.status(200).send({message: "Update Successful!"});
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbProductData => {
    if(!dbProductData) {
      res.status(404).json({ message: "No product found with this id" })
      return;
    }
    res.json(dbProductData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
