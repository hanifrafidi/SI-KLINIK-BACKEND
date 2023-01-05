const express = require('express');

// rekamMedikRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const rekamMedikRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectID;

rekamMedikRoutes.route('/rekam_medik').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('rekam_medik')
    .aggregate([
      {
        $lookup: {
          from: 'pasien',
          localField: 'pasien_id',
          foreignField: '_id',
          as: 'pasien',
        },
      },
      {
        $unwind: '$pasien',
      },
      {
        $lookup: {
          from: 'dokter',
          localField: 'dokter',
          foreignField: '_id',
          as: 'dokter',
        },
      },
      {
        $unwind: '$dokter',
      },
    ])
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send(err);
        console.log(err);
      } else {
        res.json(result);
      }
    });

  // dbConnect
  //   .collection('rekam_medik')
  //   .find()
  //   .toArray(function (err, result) {
  //     if (err) {
  //       res.status(400).send('Error fetching listings!');
  //     } else {
  //       res.json(result);
  //     }
  //   });
});

rekamMedikRoutes.route('/rekam_medik/:rekam_id').get(async function (req, res) {
  const dbConnect = dbo.getDb();
  // console.log(req.params.rekam_id)

  if (ObjectId.isValid(req.params.rekam_id) === false) {
    return res.status(404).send('rekam_medik id salah input');
  }

  dbConnect
    .collection('rekam_medik')
    .aggregate(
      {
        $match: { _id: ObjectId(req.params.rekam_id) },
      },
      {
        $lookup: {
          from: 'pasien',
          localField: 'pasien_id',
          foreignField: '_id',
          as: 'pasien',
        },
      },
      {
        $unwind: '$pasien',
      }
    )
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send(err);
        console.log(err);
      } else {
        res.json(result[0]);
      }
    });
});

rekamMedikRoutes
  .route('/rekam_medik/pasien/:pasien_id')
  .get(async function (req, res) {
    const dbConnect = dbo.getDb();

    if (ObjectId.isValid(req.params.pasien_id) === false) {
      return res.status(404).send('pasien id salah input');
    }

    dbConnect
      .collection('rekam_medik')
      .aggregate([
        {
          $match: { pasien_id: ObjectId(req.params.pasien_id) },
        },
        {
          $lookup: {
            from: 'pasien',
            localField: 'pasien_id',
            foreignField: '_id',
            as: 'pasien',
          },
        },
        {
          $unwind: '$pasien',
        },
      ])
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send(err);
          console.log(err);
        } else {
          res.json(result);
        }
      });
  });

// This section will help you create a new record.
rekamMedikRoutes.route('/rekam_medik/create').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    pasien_id: ObjectId(req.body.pasien_id),
    dokter: ObjectId(req.body.dokter),
    diagnosa: req.body.diagnosa,
    tindakan: req.body.tindakan,
    tanggal: req.body.tanggal,
  };

  dbConnect
    .collection('rekam_medik')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).json({ response: 'data berhasil di tambahkan' });
      }
    });
});

rekamMedikRoutes
  .route('/rekam_medik/update/:rekam_medik_id')
  .put(function (req, res) {
    const dbConnect = dbo.getDb();

    if (ObjectId.isValid(req.params.rekam_medik_id) === false) {
      return res.status(404).send('rekam_medik id salah input');
    }
    // console.log(ObjectId(req.params.rekam_medik_id))
    const updates = {
      $set: {
        dokter: req.body.dokter,
        diagnosa: req.body.diagnosa,
        tindakan: req.body.tindakan,
        tanggal: req.body.tanggal,
      },
    };

    dbConnect
      .collection('rekam_medik')
      .updateOne(
        { _id: ObjectId(req.params.rekam_medik_id) },
        updates,
        function (err, _result) {
          if (err) {
            res
              .status(400)
              .send(
                `Error updating likes on listing with id ${req.params.rekam_medik_id}!`
              );
            console.log(
              `Error updating likes on listing with id ${req.params.rekam_medik_id}!`
            );
          } else {
            console.log('1 document updated');
            res.json('data berhasil di update');
          }
        }
      );
  });

rekamMedikRoutes
  .route('/rekam_medik/delete/:rekam_medik_id')
  .delete((req, res) => {
    const dbConnect = dbo.getDb();

    if (ObjectId.isValid(req.params.rekam_medik_id) === false) {
      return res.status(404).send('rekam_medik id salah input');
    }

    // console.log(id)

    dbConnect
      .collection('rekam_medik')
      .deleteOne(
        { _id: ObjectId(req.params.rekam_medik_id) },
        function (err, result) {
          if (err) {
            res
              .status(400)
              .send(
                `Error deleting listing with id ${req.params.rekam_medik_id}!`
              );
          } else {
            console.log('1 document deleted');
            res.status(200).send(result);
          }
        }
      );
  });

rekamMedikRoutes.route('/rekam_medik/empty/collections').get((req, res) => {
  const dbConnect = dbo.getDb();

  // console.log(id)

  dbConnect.collection('rekam_medik').remove({}, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log('collection emptied');
      res.status(200).send(result);
    }
  });
});

module.exports = rekamMedikRoutes;
