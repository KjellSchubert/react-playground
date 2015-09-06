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

Dealing with the (mvvm/mvc) 'model' in React apps
---

First recap on WPF-style (or knockout.js-style) MVVM, trying to correlate 
aspects of MVVM with aspects of React+Flux+Relay:

* no code in views: the WPF view only binds to viewmodel properties 
  (and ICommands), with zero code in the view (xampl) itself.
* databinding: WPF textbox edits are dealt with by 2-way databinding to 
  viewmodel string or int properties: these strings are of some sort of 
  Observable string type that fires OnChange events when its content changes.
  In WPF these are normal strings living in a parent class derived from
  INotifyPropertyChanged (aka a viewmodel) which will fire events when the
  attached property changes, in knockout.js the string itself is ko.observable.
  Writing a WPF viewmodel tends to involve lots of boring boilerplate code,
  e.g. viewmodel wrapper props for model props:
  ```
    public string ArtistName
        {
            get { return Song.ArtistName; }
            set
            {
                if (Song.ArtistName != value)
                {
                    Song.ArtistName = value;
                    RaisePropertyChanged("ArtistName");
                }
            }
        }
  ```
  So when textbox content changes the WPF view code will invoke the viewmodel's
  ArtistName setter.
  Writing this sort of viewmodel code tends to feel tedious. Also wiring
  up a viewmodel can be tricky when model properties can change from an
  external source, since the model itself is not observable, only its 
  viewmodel is.
* code for user actions is impl'd in viewmodels: WPF button clicks (and 
  user actions in general) are all bound to ICommands implemented in the 
  viewmodel, the view buttons are bound against these. The impls of these
  actions typically modify both the viewmodel and the underlying model.
* so what exactly is a WPF viewmodel? Something derived from 
  INotifyPropertyChanged that is supposed to make an underlying model (which
  consists of 'regular' classes implementing business logic and being ignorant
  of views) 'observable'. It's the glue or adaptor layer between view and model
  which allows the model to 100% ignore the existence of the view, and which
  allows the view to stay 100% code-free.
* composable view models: WPF uses ObservableCollection for storing 
  collections of child viewmodels in a parent viewmodel: this is used for
  viewmodel composition. 
* composable views: for view composition the parent view will bind the child's
  view to a child viewmodel, which in xaml looks no different from binding 
  a textbox to a string property of the viewmodel.

[Here](http://www.codeproject.com/Articles/165368/WPF-MVVM-Quick-Start-Tutorial)'s 
a good tutorial for WPF, 
[here](http://learn.knockoutjs.com/) for knockout.js. What WPF does best imo
is allowed devs to keep code 100% out of the views, so layout & design aspects
are decoupled from business logic. What it does poorly is dealing with
external changes to models.

How does WPF/MVVM compare to a React+Flux|Relay architecture? 

* no (complex business logic) code in views: React components correspond to a 
  WPF view. Usually there's simple composition code in a React component's
  render function, either in the form of simple jsx-generated createElement()s, 
  or in the form of a this.props.elements.map(). This is functional-style
  declarative code, it never modifies any state, it just transforms this.props
  and this.state to a tree of elements (including parent/child view 
  composition). The this.state and this.props correspond to the WPF viewmodel. 
  See [here](http://stackoverflow.com/questions/27991366/what-is-the-difference-between-state-and-props-in-react)
  and [here](https://facebook.github.io/react/tips/communicate-between-components.html)
  for more details on this.state vs this.props: props are immutable & passed
  down from parent views (either from parent's props or state). In general
  avoid this.state, having mostly stateless components. What's a good 
  example for state? E.g. a table view's current sort order, so view state
  that's not persisted in the model? The this.state is still the most
  confusing aspect of React for me. 
  See [here](https://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html#what-should-go-in-state)
  for more details.
* databinding: the React component's render() func can be seen as dealing with
  one-way databinding (reading viewmodel, generating the view's child views,
  passing viewmodel child elems to child views via this.props).
  For the reverse databinding where user actions trigger a viewmodel update
  typically components either emit onChange events to signal an update to
  their (immutable) this.props or update this.state, with the former presumably
  being preferred. See also 
  [here](https://facebook.github.io/react/docs/two-way-binding-helpers.html) 
  for another alternative.
* code for user actions like button clicks: views expose events (like 
  onAddComment or onClick), which parent views listen to. The parent handler
  either can propagate the event further up the view chain or it does a
  this.setState() ond/or it submits to the server. If it both does setState()
  and submits to the server then this is considered an optimistic view update.
  See also onCommentSubmit in 
  [React tutorial](https://facebook.github.io/react/docs/tutorial.html).

TODO:

* https://react-bootstrap.github.io/ looks good, uses karma with React
* http://react.rocks/tag/Bootstrap has cool demos
* status of http 2 in nodejs?
* experience with alternative frameworks for dealing with a model
  supporting optimistic updates updates on the client? e.g. see
  [reflux](http://oli.me.uk/2014/12/06/my-thoughts-on-react-flux-and-reflux/),
  and gazillion alternative flux impls
  [here](http://reactjsnews.com/the-state-of-flux/)
