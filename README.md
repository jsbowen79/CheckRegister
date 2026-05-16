# Overview

I am writing this program as an attempt to create my first finished program from start to finish. I am trying to create an application for my Mother to use in order to manage her finances. All of the programs for this purpose today seem to be either web-based (save information in the cloud), or require a subscription. My mother is averse to having her information on the cloud and can't afford a subscription. As such, this is an attempt to create my first useable program that I can share with her to meet her basic financial tracking needs. This will also be a good proof of ability for my career.

This program is the skeleton for check register program that follows enterprise level banking rules. The finished program will allow users to enter information into a web-based UI to track the balances of their bank or other financial accounts. This skeleton provides the means to store accounts and transactions, to save and load accounts, and to categorize their transactions for reporting purposes. Although the program will run through a web browser, it will not require the internet and it will save all information locally. The program is written in TypeScript which is a type specific form of JavaScript.

{Provide a link to your YouTube demonstration. It should be a 4-5 minute demo of the software running and a walkthrough of the code. Focus should be on sharing what you learned about the language syntax.}

[Software Demo Video](https://www.youtube.com/watch?v=BDUTEX1FWoM)

# Development Environment

{Describe the tools that you used to develop the software}
I utilized vs-code, gitHub, and chatGPT in the development of this program. I also used Node as the runtime environment with npm as the manager for project dependencies and scripts. Vitest was used to create and run automated tests on my classes. This was used in place of jest because jest doesn't work well with modern ES Modules without advanced configuration. Vitest provides similar functionality without the configuration headaches. ES Lint and Prettier were used to identify coding errors and ensure consistent coding style. Tsx was used to run TypeScript files without requiring manual compilation.

{Describe the programming language that you used and any libraries.}
The programming language was TypeScript which is very similar to JavaScript, but it requires specific typing of variables. The libraries I used were : eslint/js for JavaScript linting rules,
@types/node for adding the TypeScript fs module,
eslint to analyze code for errors,
eslint-config-prettier which disabled lint rules that conflict with prettier,
eslint-plugin-prettier which runs prettier formatting through eslint and reports formatting issues as lint errors,
globals which provides global variables for environments so eslint can recognize them,  
prettier which formats code to maintain consistency,
ts-node which allows TypeScript files to run directly in node.js without compiling first,
tsx which runs TypeScript files with faster startup times,
typescript which provides the ability to run the TypeScript language in node,
typescript-eslint which provides TypeScript support for ESLint,
Vitest which is a testing framework to create and run automated tests on code.

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Play ](https://www.typescriptlang.org/play)
- [Chat GPT](https://chatgpt.com/)

# Future Work

{Make a list of things that you need to fix, improve, and add in the future.}

- Item 1- This is just the core functionality. I need to add other options such as the ability to edit or delete transactions.
- Item 2- I need to add a User Interface to allow users to interact with the program.
- Item 3- I need to come up with a way to store multiple accounts and provide access to the accounts by user.
- Item 4 - I need to add the ability to switch users.
