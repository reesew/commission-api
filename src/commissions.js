var mysql = require('./mysql');

function Invoice(details) {
    this.invoiceLines = {};
    for (var i in details) {
        if (details.hasOwnProperty(i)) {
            this[i] = details[i];
        }
    }
    var target = this;
    //logic for promotions, not used anymore
    //this.getInvoiceTotal = function() {
    //    if (target.invoiceTotal === undefined) {
    //        var total = 0;
    //        var invoiceLine;
    //        for (var i in this.invoiceLines) {
    //            invoiceLine = this.InvoiceLines[i];
    //            total += invoiceLine.quantityShipped * invoiceLine.unitPrice;
    //        }
    //        target.invoiceTotal = total;
    //    }
    //    return target.invoiceTotal;
    //}
    this.addLine = function(invoice) {
        target.invoiceLines[invoice.detailSeqNo] = invoice;
    }
}

function InvoiceLine(row) {
    for (var i in row) {
        if (row.hasOwnProperty(i)) {
            this[i] = row[i];
        }
    }
};

function find(userId, startDate, endDate, callback) {
    params = [userId, userId, userId, userId, userId, startDate, endDate];
    var queryText = "";
    queryText += "select * from commission_invoices where ";
    queryText += "(salespersonno = ? or salespersonno2 = ? or salespersonno3 = ? or salespersonno4 = ? or salespersonno5 = ?)";
    queryText += " and ";
    queryText += "invoicedate >= ?";
    queryText += " and ";
    queryText += "invoicedate <= ?";
    queryText += " order by invoiceno ";
    //queryText += " and ";
    //queryText += " invoiceno='0106288'";
    console.log("finding invoices");
    mysql.query(
        queryText,
        function(results) {
            return callback(resultsToInvoices(results));
        },
        params
    );
}

function resultsToInvoices(results) {
    var invoices = {};
    var invoiceLine;
    var row;
    var properties;
    console.log("results count: " + results.rows.length);
    for (var i = 0; i < results.rows.length; i++) {
        row = results.rows[i];
        //create invoice details object
        properties = {
            detailSeqNo: row.DetailSeqNo,
            itemcode: row.ItemCode,
            itemcodeDesc: row.ItemCodeDesc,
            disposable: (row.disposable === 1),
            multiplier: row.multiplier,
            quantityShipped: row.QuantityShipped,
            unitOfMeasure: row.UnitOfMeasure,
            unitOfMeasureConvFactor: row.UnitOfMeasureConvFactor,
            unitPrice: row.UnitPrice,
            baseCost: row.BaseCost
        }
        invoiceLine = new InvoiceLine(properties);
        //does this invoice header line exist? if not, create it
        if (!invoices.hasOwnProperty(row.InvoiceNo)) {
            invoices[row.InvoiceNo] = {};
        }
        //create invoice details object
        //console.log(row.HeaderSeqNo);
        if (!invoices[row.InvoiceNo].hasOwnProperty(row.HeaderSeqNo)) {
            properties = {
                invoiceNo: row.InvoiceNo,
                headerSeqNo: row.HeaderSeqNo,
                invoiceDate: row.InvoiceDate,
                shipToName: row.ShipToName,
                shipToState: row.ShipToState,
                shipToCity: row.ShipToCity,
                salesPeople: [row.SalespersonNo],
                phone: row.Comment,
                divisionNo: row.ARDivisionNo,
                customerNo: row.CustomerNo
            }
            for (var j = 2; j <= 5; j++) {
                if (row["SalespersonNo" + j] !== null) {
                    properties["salesPeople"].push(row["SalespersonNo" + j]);
                }
            }
            invoices[row.InvoiceNo][row.HeaderSeqNo] = new Invoice(properties);
        }
        invoices[row.InvoiceNo][row.HeaderSeqNo].addLine(invoiceLine);
    }
    return invoices;
}


exports.find = find;
