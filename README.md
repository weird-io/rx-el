* Copyright 2022 @ The Weird Science B.V.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
* rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
* Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
* WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
* OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
* OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**ReactiveHTMLElement**

ReactiveHTMLElement is a lightweight and reactive web-component based framework developed by The Weird Science B.V..

**Overview**

ReactiveHTMLElement provides a framework for building web components that are reactive to data changes. It utilizes a doT.js template system that allows for dynamic rendering based on changes in the underlying data.

**License**

This software is licensed under the MIT License. See the LICENSE file for details.

**Installation**

There are three ways you can have RxEl in your project.

1. CDN 
2. NPM
3. Source code

1. You can easily include RxEl in your project by adding the following script tags to your HTML file. Copy and paste these lines into the `<head>` section of your HTML file.

```html
<!-- Include ReactiveHTMLElement.js -->
<script src="https://cdn.jsdelivr.net/gh/weird-io/reactive-html-element@master/src/reactive/ReactiveHTMLElement.js"></script>

<!-- Include ReactiveHTMLElementTemplate.js -->
<script src="https://cdn.jsdelivr.net/gh/weird-io/reactive-html-element@master/src/reactive/ReactiveHTMLElementTemplate.js"></script>
```
Once you've included the scripts, you can start using the framework in your JavaScript code. Here's a simple example:

// Create an instance of ReactiveHTMLElement

```javascript
const myElement = new ReactiveHTMLElement();
```

// Do something with myElement... How to build a web component 


2. To install the reactive-html-element package using npm (Node Package Manager), follow these steps:

Make sure you have Node.js and npm installed:
If you haven't installed Node.js and npm, you can download and install them from the official website: Node.js Downloads
Open a terminal or command prompt:
On macOS or Linux, you can use the Terminal.
On Windows, you can use the Command Prompt or PowerShell.
Navigate to your project directory:
Use the cd command to navigate to the directory where you want to install the reactive-html-element package.

cd path/to/your/project

Execute the following command to install the reactive-html-element package and its dependencies:
npm install reactive-html-element

3. Include these two files in your project under src 
https://github.com/weird-io/reactive-html-element/tree/master/src/reactive


**Getting started**

Create your reactive web component


