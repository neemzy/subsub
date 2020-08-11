# subsub

Be notified when YouTube channels post videos matching specific keywords

## Setup

```sh
$ npm i
$ cp config.json.dist config.json
```

Edit the newly created file:

```json
{
  "key": "YouTube API key",
  "subs": [
    {
      "channelId": "YouTube channel id",
      "q": "keywords to search in video titles"
    },
    // ...
  ]
}
```

You can use [this online tool](https://commentpicker.com/youtube-channel-id.php) to find channel ids if needed.

## Usage

```sh
$ npm start
```

Latest videos matching your criteria will be stored locally in the `latest.json` file. Whenever this tool runs and a latest video changes, a system notification will be displayed, which you will then just have to click to see the video! Errors will also be displayed as notifications.

```
$ npm run reset
```

Removes the `latest.json` file to reset stored latest videos.
