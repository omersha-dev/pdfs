const PDFDocument = require('pdfkit');
const fs = require("fs");
const request = require("request");
// const pdf2html = require("pdf2html");
const html2pdf = require("html-pdf-node");
const path = require("path");

class PdfManager {

    constructor() {
        this.dictionary = this.initDictionary();
        this.htmlToPdf = function(htmlData, callback) {
            var options = { format: htmlData.pdfSettings.pageSize };
            var file;
            if ("url" in htmlData.data) {
                file = { url: htmlData.data.url };
            } else {
                file = { content: htmlData.data.html };
            }
            // if (!fs.existsSync(`/var/app/pdfs/Server/pdf/${htmlData.brand}`)) {
            //     fs.mkdirSync(`/var/app/pdfs/Server/pdf/${htmlData.brand}`);
            //     console.log(`/var/app/pdfs/Server/pdf/${htmlData.brand} has been created`);
            // }
            // console.log("Continued");
            console.log(`pdf/${htmlData.brand}/${htmlData.data.filename}.pdf`);
            html2pdf.generatePdf(file, options)
                .then(pdfBuffer => {
                    if ( !fs.existsSync(`pdf/${htmlData.brand}`) ) {
                        fs.mkdir(`pdf/${htmlData.brand}`, {recursive: true}, err => {})
                    }
                    fs.writeFileSync(path.resolve(__dirname, `../pdf/${htmlData.brand}/${htmlData.data.filename}.pdf`), pdfBuffer, {encoding: "binary", flag: 'w'});
                    console.log("done");
                    callback();
                })
        }
    }
    

    // Checks if the logo is already downloaded.
    // If it is not, downloads it and only THEN continues.
    // If it is downloaded already there is no need to download it again :)
    initPdf(data) {
        var imagePath = data.logo;
        // Extracts the logo file name
        var fileName = imagePath.slice(imagePath.lastIndexOf("/") + 1);
        // All logos are stored in the `logos` folder with the name provided.
        var path = `logos/${fileName}`;
        try {
            // If the logo does not exist, download it and generate the PDF.
            // Else, just generate the PDF.
            if (!fs.existsSync(path)) {
                request.head(imagePath, (err, res, body) => {
                    request(imagePath)
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        this.generatePdf(data, path);
                    });
                });
            } else {
                this.generatePdf(data, path);
            }
        } catch (err) {
            console.log(err);
            // console.log(`An error occurred while trying to find logos/${fileName}`);
        }
    }
    
    // Pretty self explainatory - generates the PDF
    generatePdf(data) {
        // Creates the PDF itself.
        var pdf = new PDFDocument({
            // Set the PDF size to the asked format
            size: data.pdfSettings.pageSize,
            margin: 10,
            info: {
                // Set the PDF's title
                Title: `Order #${data.orderData.orderID}`,
                Author: "Printer API"
            }
        });
    
        // Get the language and translated words.
        const lang = data.pdfSettings.lang;
        const words = this.dictionary[lang];
        const order = data.orderData;
    
        // Set font so to Alef in order to support Hebrew
        pdf.font("Alef-Regular.ttf");
    
        // Add the logo
        pdf.image(this.getLocalPathFromUrl(data.logo), { width: 150 });
        
        // Write texts to the PDF
        pdf.text(this.reverseString(`${words.order} #${order.orderID}`, lang));
        pdf.text(this.reverseString(`${words.customerName}: ${order.customer.first_name} ${order.customer.last_name}`, lang));
        pdf.text(this.reverseString(`${words.phone}: ${order.customer.phone}`, lang));
        pdf.text(this.reverseString(`${words.address1}: ${order.customer.address_1}`, lang));
        if (order.customer.address_2) {
            pdf.text(this.reverseString(`${words.address2}: ${order.customer.address_2}`, lang));
        }
        pdf.text(this.reverseString(`${words.city}: ${order.customer.city}`, lang));
        pdf.text(this.reverseString(`${words.orderNotes}: ${order.customer.order_note}`, lang));
    
        pdf.text(" ");
        pdf.text(this.reverseString(`${words.products}`, lang));
        order.products.forEach((product) => {
            pdf.text(this.reverseString(`${words.productName}: ${product.name} x${product.quantity}`, lang));
        });
    
        // Stream contents to a file
        pdf.pipe(
            fs.createWriteStream(`${data.brand}_${data.orderData.orderID}.pdf`)
        )
        .on("finish", () => {
            console.log("PDF Closed");
        });
    
        // Close PDF and write file
        pdf.end();
    }

    // pdfToHtml(filename) {
    //     pdf2html.html(`${htmlData.filename}.pdf`, (err, html) => {
    //         if (err) {
    //             console.log("Conversion error: " + err);
    //         } else {
    //             console.log(html);
    //         }
    //     })
    // }
    
    getLocalPathFromUrl(url) {
        return `logos/${url.slice(url.lastIndexOf("/") + 1)}`;
    }
    
    factoryFunc(param) {
        console.log(param);
        return function(e) {
            // this.generatePdf(param);
        }
    }
    
    initDictionary() {
        return {
            "heb": {
                "order": "הזמנה",
                "customerName": "שם  לקוח",
                "phone": "טלפון",
                "address1": "כתובת",
                "address2": "כתובת  נוספת",
                "city": "עיר",
                "orderNotes": "הערות",
                "products": "מוצרים",
                "productName": "שם  מוצר",
                "quantity": "כמות"
            },
            "eng": {
                "order": "Order",
                "customerName": "Customer name",
                "phone": "Phone",
                "address1": "Address 1",
                "address2": "Address 2",
                "city": "City",
                "orderNotes": "Order notes",
                "products": "Products",
                "productName": "Product name",
                "quantity": "Quantity"
            }
        }
    }
    
    reverseString(str, lang) {
        if (lang == "heb") {
            return str.split(" ").reverse().join(" ");
        }
        return str;
    }
}

module.exports = PdfManager;