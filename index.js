const PORT = 8000
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');


const app = express()


const newspappers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base : 'https://www.telegraph.co.uk'
    }
]

const articles = []

newspappers.forEach(newspapper => {
    axios.get(newspapper.address)
        .then(response => {
            const html = response.data

            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspapper.base + url,
                    source : newspapper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my climate change api')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.listen(PORT, () => console.log(`server running on ${PORT}`))