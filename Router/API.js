const express = require('express');
const fetch = require('node-fetch');
const bodyparser = require('body-parser');
const router = express.Router();
const db = require('./database');
const opnv = require('../Models/nvop');
const { sequelize } = require('../Models/nvop');

db.authenticate()
    .then(() => console.log("Database connected."))
    .catch(err => console.log(err));

router.get('/', (req, res) => {

    //console.log("default route");
    res.status(200).send("This is route /");

});

router.get('/getOP', async (req, res) => {

    // opnv.findOne({order:sequelize.random()})
    //     .then(encounter => {res.status(200).json({opening:encounter.name,move:encounter.moves})})
    //     .catch(err => console.log(err));
    let rand = Math.floor(Math.random()*4);
    console.log(rand);
    await opnv.findAll({order:sequelize.random(),limit:4})
        .then(async d =>{
            let stats = await fetch(`https://explorer.lichess.ovh/lichess?variant=standard&speeds[]=blitz&speeds[]=rapid&speeds[]=classical&ratings[]=2200&ratings[]=2500&fen=${d[0].fen}`)
                  .then(res => res.json());
            if(d == null)
                res.sendStatus(404);
            switch(rand){
                case 0:
                    res.status(200).json({question:`Given the ${d[0].name}. What is the Correct move order`,movesplayed:"",answer:d[0].moves,wrongans:d[1].moves + "|" + d[2].moves + "|" + d[3].moves,ww:stats.white,bw:stats.black,dr:stats.draws});
                    break;
                case 1:
                    let move = d[0].moves.split(' ');
                    res.status(200).json({question:`Given that they are playing ${d[0].name}. What is the correct next move?`,movesplayed:d[0].moves.substring(0,d[0].moves.length-4),answer:move[move.length-1],wrongans:"",ww:stats.white,bw:stats.black,dr:stats.draws});
                    break;
                case 2:
                    res.status(200).json({question:`You want to play the ${d[0].name}. What are the first moves?`,movesplayed:"",answer:d[0].moves.split(' ')[0],wrongans:d[1].moves.split(' ')[0] + "|" + d[2].moves.split(' ')[0] + "|" + d[3].moves.split(' ')[0],ww:stats.white,bw:stats.black,dr:stats.draws});
                    break;
                case 3:
                    res.status(200).json({question:`What is this opening?`,movesplayed:d[0].moves,answer:d[0].name,wrongans:d[1].name + "|" + d[2].name + "|" + d[3].name,ww:stats.white,bw:stats.black,dr:stats.draws});
            }
            }
        )
        .catch(err => res.status(400).send(err));


});

router.get('/stats/',(req,res) => {

    let fen = req.body.fen;
    console.log(fen);
    fetch(`https://explorer.lichess.ovh/lichess?variant=standard&speeds[]=blitz&speeds[]=rapid&speeds[]=classical&ratings[]=2200&ratings[]=2500&fen=${fen}`)
        .then(res => res.json())
        .then(txt => {
            
            console.log("Got data");
            res.status(200).send(txt);

        })
        .catch(err => res.sendStatus(400));

});

router.get('/getgame', (req,res) => {

    fetch('https://lichess.org/game/export/q7ZvsdUF')
        .then(res => res.text())
        .then(body => {console.log(body);res.status(200).send(body);})
        .catch(err => res.sendStatus(400));

});

router.get('/test', async (req,res) => {

    await opnv.findAll({order:sequelize.random(),limit:4})
        .then(async ele => {

            console.log(ele[0].name + "\n");
            console.log(ele[1].name + "\n");
            console.log(ele[2].name + "\n");
            console.log(ele[3].name + "\n");
            res.status(200).send(ele);

        })
        .catch(err => res.sendStatus(400));

});

module.exports = router;
