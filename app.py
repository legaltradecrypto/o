from flask import Flask, request, jsonify
import instaloader

app = Flask(__name__)

def download_instagram_media(url):
    loader = instaloader.Instaloader()
    
    try:
        post_shortcode = url.split("/")[-2]
        post = instaloader.Post.from_shortcode(loader.context, post_shortcode)
        
        if post.is_video:
            return {"type": "video", "url": post.video_url}
        else:
            return {"type": "image", "url": post.url}
    except Exception as e:
        return {"error": str(e)}

@app.route("/download", methods=["GET"])
def download():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "Missing URL parameter"}), 400

    media_info = download_instagram_media(url)
    return jsonify(media_info)

if __name__ == "__main__":
    app.run(debug=True)
