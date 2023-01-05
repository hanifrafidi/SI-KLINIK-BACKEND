const express = require('express');

// dokterRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const dokterRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectID;

dokterRoutes.route('/dokter').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('dokter')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

dokterRoutes.route('/dokter/:id_dokter').get(async function (req, res) {
  const dbConnect = dbo.getDb();

  if (ObjectId.isValid(req.params.id_dokter) === false) {
    return res.status(404).send('id dokter salah input');
  }

  dbConnect
    .collection('dokter')
    .findOne({ _id: ObjectId(req.params.id_dokter) }, function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

dokterRoutes.route('/dokter/cari').post(async function (req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('dokter')
    .find({ namaDepan: req.body.input })
    // .find({ $text: { $search: req.body.input } })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

dokterRoutes.route('/dokter/create').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    namaDepan: req.body.namaDepan,
    namaBelakang: req.body.namaBelakang,
    alamat: req.body.alamat,
    jenisKelamin: req.body.jenisKelamin,
    umur: req.body.umur,
    notelp: req.body.notelp,
    tanggal: new Date(),
  };

  dbConnect
    .collection('dokter')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).json({ response: 'Error inserting matches!' });
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).json({ response: 'data berhasil di tambahkan' });
      }
    });
});

dokterRoutes.route('/dokter/update/:id_dokter').put(function (req, res) {
  const dbConnect = dbo.getDb();

  if (ObjectId.isValid(req.params.id_dokter) === false) {
    return res.status(404).send('id dokter salah input');
  }

  const updates = {
    $set: {
      namaDepan: req.body.namaDepan,
      namaBelakang: req.body.namaBelakang,
      alamat: req.body.alamat,
      jenisKelamin: req.body.jenisKelamin,
      umur: req.body.umur,
      pekerjaan: req.body.pekerjaan,
      notelp: req.body.notelp,
      alergi: req.body.alergi,
      penyakit: req.body.penyakit,
      tanggal: req.body.tanggal,
    },
  };

  dbConnect
    .collection('dokter')
    .updateOne(
      { _id: ObjectId(req.params.id_dokter) },
      updates,
      function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(
              `Error updating likes on listing with id ${req.params.id_dokter}!`
            );
          console.log(
            `Error updating likes on listing with id ${req.params.id_dokter}!`
          );
        } else {
          console.log('data berhasil di update');
          res.json({ response: 'data berhasil di update' });
        }
      }
    );
});

dokterRoutes.route('/dokter/delete/:id_dokter').delete((req, res) => {
  const dbConnect = dbo.getDb();

  if (ObjectId.isValid(req.params.id_dokter) === false) {
    return res.status(404).send('id dokter salah input');
  }

  dbConnect
    .collection('dokter')
    .deleteOne({ _id: ObjectId(req.params.id_dokter) }, function (err, result) {
      if (err) {
        res
          .status(400)
          .send(
            `Error deleting listing with id_dokter ${req.params_id_dokter}!`
          );
      } else {
        res.status(200).send(result);
      }
    });
});

module.exports = dokterRoutes;
