import { PortfolioLink } from "../../components"

import { CodeBlock, monokaiSublime } from "react-code-blocks"

function Link({ label, href }: { label: string; href: string }) {
  return (
    <a
      style={{ color: "#4393bf", fontWeight: 700 }}
      href={href}
      target={href.startsWith("https") ? "_blank" : undefined}
      rel="noreferrer"
    >
      {label}
    </a>
  )
}

function Code({ text }: { text: string }) {
  return (
    <CodeBlock
      customStyle={{ margin: "1em 0" }}
      text={text}
      language="python"
      theme={monokaiSublime}
    />
  )
}

export function Post1() {
  return (
    <div
      style={{
        maxWidth: 800,
        display: "flex",
        color: "#888",
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: "white", fontSize: 50 }}>winning a hackathon</h1>
      <p>
        let me set the scene. it&apos;s 2020, i&apos;m 16, and i just joined a
        team of 4 to win a hackathon. there were a few ideas we were thinking
        about, but i was pushing for a machine learning powered hashtag picker
        for instagram, and that idea won out.
        <br />
        <br />
        it took me one sleepless night to finalize the algorithm in my head.
        i&apos;m going to describe it here.
      </p>

      <h2 style={{ color: "white" }}>the algorithm</h2>
      <p>
        the algorithm adapts to currently trending hashtags, isolates their
        contribution to a post, scores them accordingly, and finally weighs
        each score based on the image similarity to the user&apos;s proposed
        post.
      </p>

      <p>
        we first start by finding 100 hashtags. we want to use relevant
        hashtags, so we check what tags the user has already used and find
        others similar to that.
      </p>
      <Code
        text={`top_100_tags = [...] # List of predefined popular hashtags
starting_amount = 30 # The amount of hashtags to start with
total = 100 # The total amount of hashtags to scrape

# Scrape 30 of the user's previously used hashtags
starting_tags = get_user_tags(username, starting_amount)
# Handle if the user has not used hashtags in the past
if len(starting_tags) == 0:
    shuffle(top_100_tags)
    starting_tags = top_100_tags[:starting_amount] # Take the first 30

# Crawl additional tags until we reach the total
final_tags = scrape_hashtags(starting_tags, total)`}
      />

      <p>
        the additional tags are found by scraping posts that use each of our
        starting hashtags, and seeing what other hashtags they use.
        <br />
        <br />
        for each tag, engagement rate is calculated for the top 10 posts by
        multiplying a poster&apos;s average like count by their total
        followers. for each post, we calculate the difference between it&apos;s
        engagement rate and the average engagement rate of the poster&apos;s
        past 10 posts. we then average the 10 scores to create an overall score
        for that hashtag.
      </p>
      <Code
        text={`tag_scores = {}
for tag in final_tags:
    diff_rates = []

    # Get the top 10 posts of the tag
    posts = get_top_posts(tag, 10)
    
    for post in posts:
        post_eng = get_post_engagement(post)
        avg_eng = get_avg_user_engagement(post["username"], 10) # Average engagement rate of their previous 10 posts
        # post_eng and avg_eng are values from 0 to 1
        # If post_eng is high and avg_eng is low, that means the post did better, and the score will be high
        # If post_eng is low and avg_eng is high, that means the post did worse, and the score will be low
        diff_rates.append(post_eng - avg_eng)

    # Average the 10 scores
    tag_scores[tag] = sum(diff_rates) / len(diff_rates)`}
      />
      <p>
        what we now have are scores that show how much each of the 100 hashtags
        increased the engagement rate of a post vs the average. if there&apos;s
        a consistent trend over the top 10 posts, the idea is that it&apos;s
        likely that specific hashtag is to blame, and this would be more true
        the more posts you average.
        <br />
        <br />
        ideally we optimize this crawling to be way faster, and start with
        1,000 hashtags and average the top 100 posts instead.
      </p>

      <p>
        these scores are cool, but not super useful if the posts they worked on
        are not even close to what the user wants to post. this is where image
        similarity comes into play. if we know the similarity of what the user
        wants to post and the existing posts, then we can weigh the scores
        accordingly.
        <br />
        <br />
        when we calculate the engagement difference, we also need to weigh it
        by the image similarity.
      </p>
      <Code
        text={`for post in posts:
    post_eng = get_post_engagement(post)
    avg_eng = get_avg_user_engagement(post["username"], 10)
    # image_similarity returns a value from 0 to 1
    diff_rates.append(image_similarity(post["image"], user_image) * (post_eng - avg_eng))`}
      />

      <p>we then sort the scores and get the top 30 hashtags.</p>
      <Code
        text={`# We reverse it because it will order from 0 to 1 by default, then we grab the first 30
sorted_scores = sorted(tag_scores.items(), key=lambda x: x[1], reverse=True)[:30]`}
      />

      <p>
        finally, we project out the assumed engagement rate and potential likes
        for using all the hashtags.
      </p>
      <Code
        text={`avg_weighted_eng_rate = sum([x[1] for x in sorted_scores]) / len(sorted_scores)
# Engagement rate just means what percent of a user's followers like the post
# We simply have to do this to reverse the percentage and get a like count
like_count = user_followers * avg_weighted_eng_rate`}
      />

      <p>
        and we&apos;re done. we now have a list of the best 30 hashtags to use,
        and how much engagement and likes we think you&apos;ll get by using
        them.
      </p>

      <h2 style={{ color: "white" }}>the image similarity model</h2>
      <p>
        last but not least, i&apos;ll explain the image similarity model.
        <br />
        <br />
        we start by creating some training data. we do this by creating a list
        of image and hashtag pairs, then generate labels by randomly selecting
        two items and comparing how similar their hashtags are.
      </p>
      <Code
        text={`image_hashtags = [{image: ..., hashtags: ["tag1", "tag2", ...]}, ...]

dataset = []
while len(dataset) < 10000:
    a = random.choice(image_hashtags)
    b = random.choice(image_hashtags)
    
    all_tags = a["hashtags"] + b["hashtags"]
    # Remove all duplicate tags
    shared = set()
    for tag in all_tags:
        shared.add(tag)
    # Get the percentage of how many total tags are shared
    similarity = len(shared) / len(all_tags)

    dataset.append({image_a: a["image"], image_b: b["image"], label: similarity})`}
      />
      <p>
        this is good, but we&apos;ll run into an issue with data balance. we
        need to make sure that any random sample from the dataset will have an
        average similarity of 0.5, otherwise the model will overfit to learning
        whatever similarity is most common.
        <br />
        <br />
        at the end of the while loop, we need to add this:
      </p>
      <Code
        text={`...

dataset.append({image_a: a["image"], image_b: b["image"], label: similarity})

sim_goal = 0.5
# Get the average similarity of the dataset
avg_sim = sum([x["label"] for x in dataset]) / len(dataset)
# Do nothing if the similarity is within 0.1 of the goal
if avg_sim > sim_goal - 0.1 or avg_sim < sim_goal + 0.1:
    continue

# Get the index of the least and most similar pairs
least_sim = (0, 0)
most_sim = (0, 0)
for i, x in enumerate(dataset):
    sim = x["label"]
    if sim < least_sim[1]:
        least_sim = (i, sim)
    elif sim > most_sim[1]:
        most_sim = (i, sim)

# Rebalance the training data
if avg_sim < sim_goal - 0.1:
    dataset.pop(least_sim[0])
elif avg_sim > sim_goal + 0.1:
    dataset.pop(most_sim[0])`}
      />
      <p>
        what this does is constantly check if the average similarity is
        drifting away from 0.5, and rebalance accordingly. we add room for +/-
        0.1 so that it won&apos;t pop every single time we add something and
        never finish the while loop.
      </p>

      <p>
        once we have our training data, we can train the model.
        <br />
        <br />
        during training, it&apos;s a good idea to add even more variation to
        the training data. we can do this easily with PyTorch.
      </p>
      <Code
        text={`from torchvision import transforms

self.transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10, expand=True),
    transforms.Resize((128, 128)),
    transforms.ToTensor()])`}
      />
      <p>
        this will add more noise to the images and make the model better at
        generalizing.
        <br />
        <br />
        now we can set up our model.
      </p>
      <Code
        text={`import torch.nn as nn

self.relu = nn.ReLU()
self.maxpool = nn.MaxPool2d(kernel_size=3)
self.sigmoid = nn.Sigmoid()

# Build model
self.input1 = nn.Conv2d(3, 32, kernel_size=5)
self.input2 = nn.Conv2d(32, 64, kernel_size=5)
self.input3 = nn.Conv2d(64, 128, kernel_size=5)

self.hidden1 = nn.Linear(512, 512)
self.hidden2 = nn.Linear(512, 512)

self.output = nn.Linear(512, 1)`}
      />
      <p>
        3 convolutional layers, 2 dense layers, and a final sigmoid output. we
        take this simple model and do something interesting when training. we
        look at two images and pass both through the same convolutional layers.
        then we get the absolute difference of the vectors before passing them
        through the dense layers.
      </p>
      <Code
        text={`# Forward pass
x1, x2 = x[0], x[1]

input = [x1, x2] # Image 1 and Image 2

# Loop over both input images and pass them through the same convolutional layers
for index, x in enumerate(input):
    input[index] = self.maxpool(self.relu(self.input1(input[index])))
    input[index] = self.maxpool(self.relu(self.input2(input[index])))
    input[index] = self.maxpool(self.relu(self.input3(input[index])))

# Get the absolute difference of the two image vectors
out = abs(input[0].view(input[0].size(0), -1) - input[1].view(input[1].size(0), -1))

out = self.relu(self.hidden1(out))
out = self.relu(self.hidden2(out))

# Output a similarity score between 0 and 1
return self.sigmoid(self.output(out))`}
      />
      <p>
        what this does is let the model see the difference between the two
        images, and use that to determine their similarity.
        <br />
        <br />
        then we just do some training over our dataset with BCELoss and Adam
        and we&apos;re good to go.
      </p>
      <p>
        that&apos;s all i&apos;m going to go over today. you can see the actual
        code for everything{" "}
        <Link
          label="here"
          href="https://github.com/omerdemirkan/socialsense/tree/master"
        />
        . i hope you now have a clear understanding of my algorithm. if
        anything is confusing, feel free to email{" "}
        <Link label="me@jai.vin" href="mailto:me@jai.vin" />.
      </p>

      <h2 style={{ color: "white" }}>the prize</h2>
      <p>
        after 36 hours, it&apos;s done. we worked super hard, without sleep,
        and it&apos;s finally over. we can relax. all we had to do now was
        submit our work and wait.
        <br />
        <br />
        we thought we did pretty well. we thought &quot;surely we&apos;ll win
        something.&quot; there&apos;s actually a lot of different prizes you
        can win, totaling 12,864 bucks.
        <br />
        <br />
        we watch the ending livestream. winners are announced. we&apos;re
        nowhere to be seen. damn... well, i guess we were competing with 680
        other projects. better luck next time.
        <br />
        <br />
        wait a second. we got an email? from Oracle?? we won &quot;best hack
        using machine learning from Oracle&quot;??? this was a smaller, 200
        dollar prize, so i guess they didn&apos;t announce it in the
        livestream. but hey, i had fun, and we did beat out all the other ml
        projects to win this prize. i&apos;m satisfied with the outcome and
        proud of our work.
      </p>

      <PortfolioLink
        label="github repo"
        link="https://github.com/omerdemirkan/socialsense/tree/master"
      />
      <PortfolioLink
        label="hackathon submittion"
        link="https://devpost.com/software/socialsense-ai"
      />

      <p style={{ fontSize: 100, margin: 0 }}>✌️</p>
    </div>
  )
}
