These are notes of me playing with a React sample app. My goal was to 
explore the state of the art in nodejs-backed apps as of fall 2015, after
not having used nodejs for about 1-2 years. I'm starting with the outdated 
knowledge of needing something like grunt, restify, bootstrap, 
nodemon, jasmine|mocha, karma, express/koa, Q, lodash, require.js 
or whatever the latest flavor of these in 2015, which is most likely something 
completely different than 2014 :)

First goal: hello world React app.
---

Some decisions are to be made: nodejs vs iojs? Looks like these two are
planned to merge again end of 2015, sticking with nodejs then:

```
# on osx
>brew upgrade node
>node --version
v0.12.2
```

Need something to compile the JSX: Google 'grunt react' leads to tooling info 
[here](http://facebook.github.io/react/docs/tooling-integration.html),
which mentions babel (for ES6 support independent of browser capability). 
[This](http://egorsmirnov.me/2015/05/25/browserify-babelify-and-es6.html)
here talks about babelify but uses gulp instead of grunt. Which gets me to some
[grunt vs gulp](https://medium.com/@preslavrachev/gulp-vs-grunt-why-one-why-the-other-f5d3b398edc4)
discussion, and I like gulp better. Instead of installing grunt or 
gulp and a dozen tools manually via npm install it's a lot easier to
start with one of many yeoman templates: see 
[here](http://yeoman.io/generators/). Picking the most common React one
I get:

```
git clone -o react-starter-kit -b master --single-branch \
      https://github.com/kriasoft/react-starter-kit.git MyApp
cd MyApp
npm install
npm start  
```

Couldn't get much easier than that: editing & saving any frontend files takes 
about two secs to update the browser view with that change, nice. Sadly
there are no yeoman templates out there yet that replace Flux with 
[Relay+graphql](https://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html).

Other choices: 

* [browserify vs webstack](http://blog.namangoel.com/browserify-vs-webpack-js-drama). For React apps webstack seems the better option? Not sure.
* mocha vs jasmine|jest vs karma. For React apps jest seems the better option. 

Minimal react app from scratch
---

Experimentally: instead of cloning some yeoman template start from scratch.
Need JSX compiler at a minimum.

```
npm install -g gulp
echo {} > package.json
npm install --save-dev gulp
npm install --save-dev gulp-react
npm install --save-dev gulp-watch
npm install --save-dev browserify
...
```

Or easier get a premade minimal recipe:

```
wget https://gist.githubusercontent.com/Sigmus/9253068/raw/e44f4b
01b74637cdfed6ec0329941d07e9c19bf7/gulpfile.js
wget https://gist.githubusercontent.com/Sigmus/9253068/raw/e44f4b01b74637cdfed6ec0329941d07e9c19bf7/package.json
npm install
```

Gives poor err msgs for whatever reason. Let's setup tools for manual build via cmd line without gulp for comparison:

```
npm install -g reactify
npm install -g browserify
browserify -t reactify src/app.js
```

Gave better error messages, the gulpfile is suboptimal. Now serving the
browserified React app:

```
npm install express --save
npm install -g nodemon
nodemon src/server.js 
```

TODO:

* https://react-bootstrap.github.io/ looks good, uses karma with React
* http://react.rocks/tag/Bootstrap has cool demos
* status of http 2 in nodejs?
* experience with alternative frameworks for dealing with a model 
  supporting optimistic updates updates on the client? e.g. see 
  [reflux](http://oli.me.uk/2014/12/06/my-thoughts-on-react-flux-and-reflux/),
  and gazillion alternative flux impls 
  [here](http://reactjsnews.com/the-state-of-flux/)

