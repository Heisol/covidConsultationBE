const express = require("express");
const cors = require("cors")
const client = require('../Middleware/mongo')

const router = express.Router();

router.use(cors())

router.get('/:id', async (req, res)=>{
    const id = req.params.id
    const clientStat = await client.connect()
    if (clientStat && (id && id !== undefined && id !== null && id !== '')){
        try {
            const findCursor = await client.db('covidConsulation').collection('monitoring').find({id: id}).toArray()
            if (!findCursor) res.send({status: success, log: 'empty'})
            res.send({status: 'success', log: 'User data found', history: findCursor})
            client.close()
        } catch (error) {
            res.send({status: 'error', log: error.message})
        }
    }
})

module.exports = router;