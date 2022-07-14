const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(tagRow => res.json(tagRow))
    .catch(err => {
      console.log(err);
      res.ststus(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(tagRow => {
      if (!tagRow) {
        res.status(404).json({ message: 'That tag does not exist!' });
        return;
      }
      res.json(tagRow);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  })
    .then(tagRow => res.json(tagRow))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tag.update(
    {
      tag_name: req.body.tag_name
    },
    { 
      where: {
        id: req.params.id
      }
    }
  )
  .then(tagRow => {
    if (!tagRow[0]) {
      res.status(404).json({ message: 'That tag does not exist!'});
      return;
    }
    res.json(tagRow)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(tagRow => {
    if (!tagRow) {
      res.status(404).json({ message: 'That tag does not exist!' });
      return;
    }
    res.json(tagRow);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


module.exports = router;
