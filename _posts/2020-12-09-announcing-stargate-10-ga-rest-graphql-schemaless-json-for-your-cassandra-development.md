---
layout: post
title: "Announcing: Stargate 1.0 GA; REST, GraphQL, & Schemaless JSON for Your Cassandra Development"
subtitle: "Level-up your app dev with fast and easy data APIs for the world’s most battle tested database."
date:   2020-12-09 00:00:00 -0000
synopsis: We have tons of APIs integrated within great tools for building dynamic, full stack apps. If you are a developer, you probably are using technologies like schemaless data stores, serverless architectures, JSON APIs, and/or the GraphQL language.
author_info:
  name:
    first: "Denise"
    last: "Gosnell"
  picture: "assets/images/stargate-profile.png"
---

It is a really great time to be a developer.

We have tons of APIs integrated within great tools for building dynamic, full stack apps. If you are a developer, you probably are using technologies like schemaless data stores, serverless architectures, JSON APIs, and/or the GraphQL language.

Further, there are a bunch of cool frameworks like the **Jam**stack (**J**avaScript, **A**PIs, and **M**arkup) and services like Netlify to make it fast to deploy a serverless app.

And now, for the first time ever, Apache Cassandra is a part of this stack because [Stargate is now live on Astra](https://astra.datastax.com/) as the official data API.

The modern apps we build need data APIs which integrate into our toolset and work with native data shapes (JSON, REST, GraphQL, etc). These data APIs need to support schemaless JSON, while simultaneously providing speed and scalability.

Most importantly, it better only take a few minutes for us to use them within our project.

DataStax built [Stargate](https://stargate.io/) into Astra to give us, app developers, a natural data API stack which meshes with the Jamstack (or serverless stack of your choice). Stargate in Astra is built on the rock solid NoSQL data engine (Apache Cassandra) which powers Netflix, Instagram, Yelp, iCloud and other apps we all use everyday.

## What exactly is Stargate?
Stargate is an [open source data gateway](https://stargate.io/2020/09/14/init-stargate.html) that sits between your app server and your databases. Stargate brings together an API platform and data request coordination code into one OSS project. 

Multiple successful app companies - like Netflix and Yelp - built their own data gateways to help internal app developers create features using simple APIs, without needing to learn the underlying database or mess with schema.  

DataStax integrated Stargate into Astra to give you the same power and ease of access to your data.

What does this mean for you?

- No upfront data modelling needed for Documents.
- Less custom code to maintain.
- More time to build what you care about.

![](/assets/images/stargate-astra/stargate-astra.png)

You can work with your data the way you want -- JSON via schemaless document APIs or database schema aware GraphQL and RESTful APIs -- while Stargate serves as the proxy that coordinates these requests to different flavors of Cassandra.

To see it in action, let’s see how this works by using JSON with Stargate’s schemaless Document API in a TikTok clone. Because, if Instagram and Snapchat have a TikTok clone, we should have one, too. Right?

## Real Quick Note First

Slinging JSON to and from Apache Cassandra without data modeling is just too much fun. You gotta [try this out in Astra for yourself](http://astra.datastax.com/). You can get [hands on with it right away](https://www.datastax.com/dev/documents-api) or check out our [sample app gallery](https://astra.datastax.com/sample-app-gallery) to see schemaless Cassandra in action.

We are stoked to have engineers from Netflix, Burberry, Macquarie Bank, USAA, and Yelp creating Stargate with us. They are already hard at work battletesting the APIs and collaborating on new features. 

Ok, onto the code!

## Posts in TikTok

We are going to walk through using Stargate’s APIs in Astra for creating and updating posts within a TikTok clone. We’re walking through examples that are ready to be pasted into your latest Jamstack app.

To use Stargate in Astra in your app, first install and set up our [JavaScript SDK](https://www.npmjs.com/package/@astrajs/collections). You can learn about storing environment [variables in your .env file here](https://www.youtube.com/watch?v=vSmzEGZQI5A). 

Let’s start with a basic TikTok post: a video with a caption, like:


{% highlight javascript %}
const postData = {
  "postId": 0,
  "video": "https://i.imgur.com/FTBP02Y.mp4",
  "caption": "These ducks are cute",
  "timestamp": "2020-12-09T09:08:31.020Z",
  "likes": 0,
}
{% endhighlight %}

After connecting to Stargate in Astra with a nodejs client, let’s create a new collection in our app and add the post with:

{% highlight javascript %}
const postsCollection = astraClient.namespace("tikTokClone").
  collection("posts");

const post = await postsCollection.create(postData);
{% endhighlight %}

If you’ve ever used Cassandra before, you know this is amazing. Look at what we didn't do: no data modeling, no table creation, no configuration code, no partition keys, no clustering columns. I think you get my drift. 

Stargate in Astra allows you to add data to Apache Cassandra in one line of code. 

This level of ease of use hasn't previously been possible with Cassandra. Insert JSON and move on. 

Next up, let’s say you want to find all posts about ducks. You can do that via:


{% highlight javascript %}
// find all posts about ducks
const posts = await postsCollection.find({ caption: 
  { $in:  ["ducks"] } });

{% endhighlight %}

And boom. Now you have your ducks channel all set up for your users. Because who doesn’t want a stream fully dedicated to ducks? 

Now, your app isn’t going to [be like Twitter](https://www.newsweek.com/twitter-fleets-reactions-memes-edit-button-1548037). We can edit stuff here. Let’s show how to edit your post’s caption. Stories tho? That’s on you

{% highlight javascript %}
// update the post’s caption
const post = await postsCollection.update(post.documentId, {
  caption: "These ducks are MEGA cute",
});

{% endhighlight %}

The above was just a quick tour on how to do a few data API calls for a basic TikTok clone. Want to see the full thing? Check out [Ania Kubow](https://www.youtube.com/watch?v=IATOicvih5A)’s tutorial to see how to wire this up into a full React app with Netlify.

## What’s next?

For more examples, we have hands-on tutorials for using [Stargate’s REST](https://www.datastax.com/dev/rest), [Document](https://www.datastax.com/dev/documents-api) and [GraphQL APIs](https://www.datastax.com/dev/graphql). Check ‘em out and let us know what you think. 

Have an app idea or want to join the fun? [You can join the Stargate community, too](https://discord.gg/2Xt8QNyFZA).

We would love to see how you customize your TikTok clone to show off more ways to feature data in your app. Or, you can create your own non-TikTok example. We would love to showcase your example in our [sample app gallery](https://astra.datastax.com/sample-app-gallery), so tell us about it in [our contribute channel](https://discord.gg/33mKDHHFUE).

## So, you are down here looking for a few more details
If you came down here, maybe you are looking for a few more lines of code.

No problem.

Let’s show how to set up the node JS client and a few more data API calls. For starters, let’s take a look at how to set up your client to connect to Stargate in Astra.

{% highlight javascript %}
// npm install @astrajs/collections
const { createClient } = require("@astrajs/collections");

// create an Astra client
const astraClient = await createClient(
{   astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    username: process.env.ASTRA_DB_USERNAME,
    password: process.env.ASTRA_DB_PASSWORD,
});

{% endhighlight %}

Easy enough. 

Then, let’s create a users collection in our database to store documents about our TikTok users:

{% highlight javascript %}
// create the users collection in the app
const usersCollection = astraClient.namespace("tikTokClone").collection("users");

{% endhighlight %}

A TikTok user in our app will have the basics: a unique id, a name, username, etc.

{% highlight javascript %}
const userData = {
  "id_3": "0",
  "name": "Mo Farooq",
  "username": "mofarooq32",
  "avatar": "https://i.imgur.com/9KYq7VG.png"
};

{% endhighlight %}

So, let’s add our user into our collection:

{% highlight javascript %}
// create a new user
const user = await usersCollection.create(userData);

{% endhighlight %}

You can check to make sure your user was stored in the database by reading the user back by any of their properties, like their username.

{% highlight javascript %}
// find our user by username
const users = await usersCollection.find({ username: { $eq: 
  "mofarooq32" } });
{% endhighlight %}

Or, you can lookup a user by their **documentId**:

{% highlight javascript %}
// get the user by document id
const user = await usersCollection.get(user.documentId);
{% endhighlight %}

And, lastly, if you need to delete that user:

{% highlight javascript %}
// delete the post
const user = await usersCollection.delete(user.documentId);
{% endhighlight %}

Want to see the full code? Check out [Ania Kubow’s app](https://github.com/kubowania/stargate-tik-tok) to get all the goodness and start customizing it on your own. Let me know when you have stories up and I can subscribe to your ducks channel. 

Thank you for following along all the way down here. 

Happy building!

