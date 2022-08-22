# Event and invoicing application.

This is a serverless based application for an invoice and event planning.

# Invoicing

## Running Locally

Requires node v16, aws-cli (aws), serverless (sls)

1.  Run the backend invoice-service using serverless-offline (note auth will always be approved using offline)
    `cd invoice-service`
    `npm i`
    `sls offline`
2.  Run the front end
    `cd invoice-next`
    create an auth0 account and application and create a .env as per the example.env
    `npm i`
    `npm run dev`

## Publishing to the cloud

1.  Create a new IAM user then configure your region with
    `aws configure`
2.  For each of the services, invoice-service, auth-service
    `cd invoice-service`

    Deploy to your own instance:

    `sls deploy --verbose`

    Check the routes it has created:

    `sls info`

3.  Vercel is used to hosr the front-end next app.

# Folders

## invoice-service

A serverless app using dynamodb, SQS and S3. Cloudformation creates lambda functions and application gateway. Allows you to create and email an invoice, and marked it as payed. There is a reminder system to send email when it is overdue.
The function `remindInvoice` is set to run every 5 days to email out and overpaid invoices. It can be ran seperately using `sls invoke -f remindInvoice -l`.

## auth-service

lambda function with auth0 authorization.

## notification-service

A queue service using SQS that sends emails and texts out using SES and SNS

## invoice-next

The front end for the invoicing app. The list of invoices is server-side-rendered, the administraion and paying invoices is client-side-rendered. A next application that mui, formik, auth0.
