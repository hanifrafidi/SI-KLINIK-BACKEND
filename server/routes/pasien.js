const express = require('express');

// pasienRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const pasienRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectID;

const isExist = (id_pasien) => {
  const db = dbo.getDb().collection('pasien');
  return db.countDocuments({ _id: id_pasien });
};

pasienRoutes.route('/pasien').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('pasien')
    .find({})
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

pasienRoutes.route('/pasien/:id_pasien').get(async function (req, res) {
  const dbConnect = dbo.getDb();

  if (ObjectId.isValid(req.params.id_pasien) === false) {
    return res.status(404).send('id pasien salah input');
  }

  dbConnect
    .collection('pasien')
    .findOne({ _id: ObjectId(req.params.id_pasien) }, function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

pasienRoutes.route('/pasien/cari').post(async function (req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('pasien')
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

pasienRoutes.route('/pasien/create').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
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
  };

  dbConnect
    .collection('pasien')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send({ response: 'Error inserting matches!' });
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).json({ response: 'data berhasil di tambahkan' });
      }
    });
});

pasienRoutes.route('/pasien/update/:id_pasien').put(async function (req, res) {
  const dbConnect = dbo.getDb();
  if (ObjectId.isValid(req.params.id_pasien) === false) {
    return res.status(404).send('id pasien salah input');
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

  const cekData = await isExist(ObjectId(req.params.id_pasien));

  if (cekData === 0) {
    return res.status(404).send('id pasien tidak ada di database');
  }

  dbConnect
    .collection('pasien')
    .updateOne(
      { _id: ObjectId(req.params.id_pasien) },
      updates,
      function (err, _result) {
        if (err) {
          res;
          res
            .status(400)
            .json(`Error updating on Pasien with id ${req.params.id_pasien}!`);
          console.log(
            `Error updating likes on listing with id ${req.params.id_pasien}!`
          );
        } else {
          console.log('data berhasil di update');
          res.json('data berhasil di update');
        }
      }
    );
});

pasienRoutes.route('/pasien/delete/:id_pasien').delete((req, res) => {
  const dbConnect = dbo.getDb();

  if (ObjectId.isValid(req.params.id_pasien) === false) {
    return res
      .status(404)
      .send('id pasien salah input atau tidak ditemukan di database');
  }

  // console.log(id)

  dbConnect
    .collection('pasien')
    .deleteOne({ _id: ObjectId(req.params.id_pasien) }, function (err, result) {
      if (err) {
        res
          .status(400)
          .send(`Error delete pasien with id ${req.params.id_pasien}!`);
      } else {
        res.status(200).send(result);
      }
    });
});

module.exports = pasienRoutes;
