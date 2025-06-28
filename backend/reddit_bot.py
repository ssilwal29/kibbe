import os
import base64
import requests
import praw
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    username=os.getenv("REDDIT_USERNAME"),
    password=os.getenv("REDDIT_PASSWORD"),
    user_agent=os.getenv("REDDIT_USER_AGENT", "kibbe-ai-bot"),
)


def _analyze_image(url: str):
    img = requests.get(url).content
    b64 = base64.b64encode(img).decode()
    data_url = f"data:image/jpeg;base64,{b64}"
    analysis = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {"role": "system", "content": "You are a Kibbe body typing expert."},
            {"role": "user", "content": f"Image: {data_url}"},
        ],
    ).choices[0].message.content
    style = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a Kibbe style consultant."},
            {"role": "user", "content": f"Based on: {analysis}, give me a style guide."},
        ],
    ).choices[0].message.content
    return analysis, style


def _image_urls(submission):
    if getattr(submission, "is_gallery", False) and submission.media_metadata:
        return [data["s"]["u"] for data in submission.media_metadata.values()]
    return [submission.url]


def answer_post(url: str, all_images: bool = False):
    submission = reddit.submission(url=url)
    if submission.is_self:
        raise ValueError("Post has no image to analyze")
    urls = _image_urls(submission)
    if not all_images:
        urls = urls[:1]
    parts = []
    for idx, img_url in enumerate(urls, 1):
        analysis, style = _analyze_image(img_url)
        parts.append(
            f"### Image {idx}\n\n**Kibbe Analysis**\n{analysis}\n\n**Style Guide**\n{style}"
        )
    comment = "\n\n".join(parts) + "\n\n*Generated with Kibbe AI*"
    submission.reply(comment)
    print("Replied to post:", url)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Analyze a Reddit post and reply with Kibbe results"
    )
    parser.add_argument("post_url", help="URL of the Reddit post to analyze")
    parser.add_argument(
        "--all",
        action="store_true",
        dest="all_images",
        help="analyze all images in the post if multiple are present",
    )
    args = parser.parse_args()
    answer_post(args.post_url, all_images=args.all_images)
