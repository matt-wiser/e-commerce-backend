const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll({
    include: [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock']
    }]
  })
  .then(categoryRows => res.json(categoryRows))
  .catch(err => {
    console.log(err);
    res.status(500),json(err);
  });
});

router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock']
    }]
  })
  .then(categoryRow => res.json(categoryRow))
  .catch(err => {
    console.log(err);
    res.status(500),json(err);
  });
});

router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  .then(categoryRow => res.json(categoryRow))
  .catch(err => {
    console.log(err);
    res.status(500),json(err);
  });
});

router.put('/:id', (req, res) => {
  Category.update(
    {
      category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(categoryRow => {
    if (!categoryRow) {
      res.status(404).json({message: 'No category matching this id!'});
      return;
    }
    res.json(categoryRow);
  })
  .catch(err => {
    console.log(err);
    res.status(500),json(err);
  });
});

router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(categoryRow => {
    if (!categoryRow) {
      res.status(404).json({message: 'No category matching this id!'});
      return;
    }
    res.json(categoryRow);
  })
  .catch(err => {
    console.log(err);
    res.status(500),json(err);
  });
});

module.exports = router;
