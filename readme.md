# Image Processing API
This is an API that can convert an image from supported type to another and resize an image to the preferred size.

## Scripts 
-      npm install: intall all the project dependencies
-      npm run build: compile the code to javascript
-      npm run jasmine: run tests on the compiled javascript code
-      npm run test: compile and run the tests in one step
-      npm run lint: lint the code for errors and warnings
-      npm run prettier: format the code to standard
-      npm run devStart: start the development server
-      npm run start: start the production server

## Supported image formats
Supported image formats inlude: jpeg, png, webp, gif, avif, and tiff

## Usage
Query parameters include the following
- filename
- width
- height
- input
- output

All parameters are optional. 
An image named default will be use if filename is not specified.

If only height is specified, the width will be auto scaled to match the given height

If only width is specified, the height will be auto scaled to match the given height

If the input is not specified, jpeg will be used and converted to the given format output

If the output is not specified, the input image will be converted to the jpeg format

## Example API Routes

BASE ROUTE: /img-pro-api/api/v1/convert

| ROUTE   |      VERB      |  ACTION |
|:----------|:-------------|:------|
| /?filename=cool-image |  GET | returns the original version of cool-image (jpeg since output isn't specified) |
| /?filename=cool-image&height=200&output=png |    GET   |   converts cool-image.jpg to a png image of height 200px and width auto and returns the converted image |
| /?filename=cool-image&width=200&output=webp&input=tiff | GET | converts cool-image.tiff to a webp image of width 200px and height auto and returns the converted image |
| /?filename=cool-image&width=200&output=jpeg&input=avif&height=300 | GET | converts cool-image.jpeg to an avif image of width 200px and height 300px and returns the converted image |
| /?width=200&height=300&output=jpeg | GET | converts default.jpeg to a a jpeg image of 200px width and 300px height and return the converted image |

