const express = require('express');
const fetch = require('node-fetch');
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
    let rand = Math.floor(Math.random()*3);
    console.log(rand);
    await opnv.findOne({order:sequelize.random()})
        .then(async d =>{
            let stats = await fetch(`https://explorer.lichess.ovh/lichess?variant=standard&speeds[]=blitz&speeds[]=rapid&speeds[]=classical&ratings[]=2200&ratings[]=2500&fen=${d.fen}`)
                  .then(res => res.json());
            if(d == null)
                res.sendStatus(404);
            switch(rand){
                case 0:
                    res.status(200).json({question:`Given the ${d.name}. What is the Correct move order`,answer:d.moves,ww:stats.white,bw:stats.black,dr:stats.draws});
                    break;
                case 1:
                    let move = d.moves.split(' ');
                    res.status(200).json({question:`Given that they are playing ${d.name}. What is the correct next move?`,answer:move[move.length-1],ww:stats.white,bw:stats.black,dr:stats.draws});
                    break;
                case 2:
                    res.status(200).json({question:`You want to play the ${d.name}. What is the first move?`,answer:d.moves.split(' ')[1],ww:stats.white,bw:stats.black,dr:stats.draws});
                    break;
            }
            }
        )
        .catch(err => res.status(400).send(err));


});

router.get('/stats',(req,res) => {

    fetch('https://explorer.lichess.ovh/lichess?variant=standard&speeds[]=blitz&speeds[]=rapid&speeds[]=classical&ratings[]=2200&ratings[]=2500&fen=rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq')
        .then(res => res.json())
        .then(txt => {
            
            console.log(txt);
            res.status(200).send(txt);

        });

});

module.exports = router;
