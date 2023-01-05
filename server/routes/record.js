const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.route('/listings').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('pasien')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/rekam_medik').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('rekam_medik')
    .find()
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/pasien').get(async function (_req, res) {
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

recordRoutes.route('/pasien/:pasien_id').get(async function (req, res) {
  const { ObjectId } = require('mongodb');
  let id = 0;

  const dbConnect = dbo.getDb();
  // console.log(req.params.pasien_id)

  if (typeof req.params.pasien_id === 'undefined') {
    console.log('pasien id is undefined');
    return res.status(400).json({ data: 'please input pasien id' });
  }

  if (req.params.pasien_id !== '0') {
    id = ObjectId(req.params.pasien_id);
  }

  dbConnect.collection('pasien').findOne({ _id: id }, function (err, result) {
    if (err) {
      res.status(400).send('Error fetching listings!');
    } else {
      res.json(result);
    }
  });
});

recordRoutes.route('/rekam_medik/:rekam_id').get(async function (req, res) {
  const { ObjectId } = require('mongodb');
  let id = 0;
  const dbConnect = dbo.getDb();
  // console.log(req.params.rekam_id)

  if (typeof req.params.rekam_id === undefined) {
    console.log('rekam id is undefined');
    return res.status(400).json({ data: 'please input rekam id' });
  }

  if (req.params.rekam_id !== '0') {
    id = ObjectId(req.params.rekam_id);
  }

  dbConnect
    .collection('rekam_medik')
    .findOne({ _id: id }, function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

recordRoutes.route('/pasien/cari').post(async function (req, res) {
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

recordRoutes.route('/pasien/delete/:pasien_id').delete((req, res) => {
  // const dbConnect = dbo.getDb();
  // const listingQuery = { listing_id: req.body.id };

  const { ObjectId } = require('mongodb');
  let id = '';

  const dbConnect = dbo.getDb();

  if (req.params.pasien_id === 'undefined') {
    console.log('pasien id is undefined');
    return res.status(400).json({ data: 'please input pasien id' });
  }

  id = ObjectId(req.params.pasien_id);

  // console.log(id)

  dbConnect
    .collection('pasien')
    .deleteOne({ _id: id }, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting listing with id ${id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

recordRoutes.route('/rekam_medik/delete/:rekam_id').delete((req, res) => {
  const { ObjectId } = require('mongodb');
  let id = '';

  const dbConnect = dbo.getDb();

  if (req.params.pasien_id === 'undefined') {
    console.log('pasien id is undefined');
    return res.status(400).json({ data: 'please input pasien id' });
  }

  id = ObjectId(req.params.pasien_id);

  // console.log(id)

  dbConnect
    .collection('rekam_medik')
    .deleteOne({ _id: id }, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting listing with id ${id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

recordRoutes
  .route('/rekam_medik/pasien/:pasien_id')
  .get(async function (req, res) {
    const dbConnect = dbo.getDb();
    const { ObjectId } = require('mongodb');

    var id_pasien = 0;

    if (req.params.pasien_id === undefined) {
      console.log('pasien id is undefined');
      return res.status(400).json({ data: 'please input pasien id' });
    }

    if (req.params.pasien_id !== '0') {
      id_pasien = ObjectId(req.params.pasien_id);
    }

    dbConnect
      .collection('rekam_medik')
      .find({ pasien_id: id_pasien })
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send('Error fetching listings!');
        } else {
          res.json(result);
        }
      });
  });

// This section will help you create a new record.
recordRoutes.route('/rekam_medik/create').post(function (req, res) {
  const { ObjectId } = require('mongodb');

  if (req.body.pasien_id === 'undefined' || req.body.pasien_id === 0) {
    console.log('pasien id is undefined');
    return res.status(400).json({ data: 'please input pasien id' });
  }

  const dbConnect = dbo.getDb();
  const matchDocument = {
    pasien_id: ObjectId(req.body.pasien_id),
    dokter: req.body.dokter,
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
        res.status(204).json({
          response: 'data berhasil di inputkan',
        });
      }
    });
});

recordRoutes.route('/pasien/create').post(function (req, res) {
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
        res.status(400).json({ response: 'Error inserting matches!' });
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).json({ response: 'data berhasil di tambahkan' });
      }
    });
});

// This section will help you update a record by id.
recordRoutes.route('/listings/updateLike').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: req.body.id };
  const updates = {
    $inc: {
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
    .collection('listingsAndReviews')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
        res.json({ response: 'data berhasil di update' });
      }
    });
});

recordRoutes.route('/pasien/update/:pasien_id').put(function (req, res) {
  const dbConnect = dbo.getDb();
  const { ObjectId } = require('mongodb');

  if (req.params.pasien_id === 'undefined') {
    console.log('pasien id is undefined');
    return res.status(400).json({ data: 'please input pasien id' });
  }
  // console.log(ObjectId(req.params.pasien_id))
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
    .collection('pasien')
    .updateOne(
      { _id: ObjectId(req.params.pasien_id) },
      updates,
      function (err, _result) {
        if (err) {
          res
            .status(400)
            .send(
              `Error updating likes on listing with id ${req.params.pasien_id}!`
            );
          console.log(
            `Error updating likes on listing with id ${req.params.pasien_id}!`
          );
        } else {
          console.log('data berhasil di update');
          res.json({ response: 'data berhasil di update' });
        }
      }
    );
});

recordRoutes
  .route('/rekam_medik/update/:rekam_medik_id')
  .put(function (req, res) {
    const dbConnect = dbo.getDb();
    const { ObjectId } = require('mongodb');

    if (req.params.rekam_medik_id === 'undefined') {
      console.log('rekam_medik id is undefined');
      return res.status(400).json({ data: 'please input rekam_medik id' });
    }

    const listingQuery = { _id: ObjectId(req.params.rekam_medik_id) };
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
                `Error updating likes on listing with id ${listingQuery._id}!`
              );
            console.log(
              `Error updating likes on listing with id ${listingQuery._id}!`
            );
          } else {
            console.log('1 document updated');
            res.json({ response: 'data berhasil di update' });
          }
        }
      );
  });

// This section will help you delete a record.
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('listingsAndReviews')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
        res.json({ response: 'data berhasil di hapus' });
      }
    });
});

module.exports = recordRoutes;
