package com.blog.fit.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.blog.fit.domain.PostStatus;
import com.blog.fit.domain.entities.Category;
import com.blog.fit.domain.entities.Post;
import com.blog.fit.domain.entities.Tag;
import com.blog.fit.domain.entities.User;
import com.blog.fit.repositories.PostRepository;
import com.blog.fit.repositories.UserRepository;
import com.blog.fit.services.CategoryService;
import com.blog.fit.services.TagService;

import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    @Transactional
    public CommandLineRunner seedDatabase(
        PostRepository postRepository,
        UserRepository userRepository,
        CategoryService categoryService,
        TagService tagService
    ) {
        return args -> {
            System.out.println("DataSeeder bean initialized. Starting seeding process...");

            // Check if the author already exists
            User author = userRepository.findByEmail("author@example.com")
                    .orElseGet(() -> {
                        System.out.println("Creating new author...");
                        User newAuthor = User.builder()
                                .name("John Doe")
                                .email("author@example.com")
                                .password("password") // WARNING: Hash this in production
                                .build();
                        return userRepository.saveAndFlush(newAuthor);
                    });

            System.out.println("Author: " + author.getEmail());

            // Create or find Nutrition category
            Category nutritionCategory = categoryService.listCategories().stream()
                    .filter(category -> "Nutrition".equalsIgnoreCase(category.getName()))
                    .findFirst()
                    .orElseGet(() -> {
                        System.out.println("Creating category: Nutrition");
                        return categoryService.createCategory(
                                Category.builder().name("Nutrition").build()
                        );
                    });
            System.out.println("Category: " + nutritionCategory.getName());

            // Create tags

        // Create or find Myths category
        Category mythsCategory = categoryService.listCategories().stream()
                        .filter(category -> "Myths".equalsIgnoreCase(category.getName()))
                        .findFirst()
                        .orElseGet(() -> {
                                System.out.println("Creating category: Myths");
                                return categoryService.createCategory(
                                                Category.builder().name("Myths").build()
                                );
                        });
        System.out.println("Category: " + mythsCategory.getName());


        // Create or find Gym Accessories category
        Category gymAccessoriesCategory = categoryService.listCategories().stream()
                .filter(category -> "Gym Accessories".equalsIgnoreCase(category.getName()))
                .findFirst()
                .orElseGet(() -> {
                    System.out.println("Creating category: Gym Accessories");
                    return categoryService.createCategory(
                            Category.builder().name("Gym Accessories").build()
                    );
                });
        System.out.println("Category: " + gymAccessoriesCategory.getName());
            // Create tags
            System.out.println("Creating tags: Wellness, GutHealth, Vegan, LabelReading, Focus, FitnessMyths");
            Tag tagWellness = tagService.createTag("Wellness");
            Tag tagGutHealth = tagService.createTag("GutHealth");
            Tag tagVegan = tagService.createTag("Vegan");
            Tag tagLabelReading = tagService.createTag("LabelReading");
            Tag tagFocus = tagService.createTag("Focus");
            Tag tagFitnessMyths = tagService.createTag("FitnessMyths");
            Tag tagGym = tagService.createTag("Gym");
            Tag tagSnack = tagService.createTag("Snack"); 


            // Create blog posts
            System.out.println("Creating Nutrition blog posts...");

            // Update existing posts with correct photo paths
            updateExistingPostPhotos(postRepository);

            createPostIfNotExists(postRepository,
                    "The Science of Snacking: Healthy Choices for Busy People",
                    "This post breaks down the science behind smart snacking, how to manage energy levels during the day, and top snack recommendations.",
                    author,
                    nutritionCategory,
                    Set.of(tagSnack),
                    "photo_10.png"
            );

            createPostIfNotExists(postRepository,
                    "Gut Feeling: How Your Microbiome Impacts Mood, Weight & Health",
                    "Explore how gut bacteria influence digestion, brain health, and immunity, with practical tips for improving your gut through diet.",
                    author,
                    nutritionCategory,
                    Set.of(tagGutHealth),
                    "photo_2.png"
            );

            createPostIfNotExists(postRepository,
                    "What Shoes's should You Be Lifting In?",
                    "Helps plant-based eaters confidently meet protein needs, debunking myths and showing how to build a strong diet without animal products.",
                    author,
                    gymAccessoriesCategory,
                    Set.of(tagGym),
                    "photo_3.png"
            );

            createPostIfNotExists(postRepository,
                    "Decoding Food Labels: What They Say, What They Mean, and What to Ignore",
                    "A practical guide to understanding nutrition labels, ingredient lists, and misleading health claims on food packaging.",
                    author,
                    nutritionCategory,
                    Set.of(tagLabelReading),
                    "photo_4.png"
            );

            createPostIfNotExists(postRepository,
                    "Nutrition for Focus: What to Eat to Supercharge Your Brain",
                    "This blog outlines foods that enhance brain function, improve concentration, and provide sustainable cognitive energy throughout the day.",
                    author,
                    nutritionCategory,
                    Set.of(tagFocus),
                    "photo_6.png"
            );

          createPostIfNotExists(postRepository,
    "Should You Be Avoiding Zero-Calorie Drinks?",
    """
    <p>Zero-calorie drinks like diet sodas, flavored waters, and sugar-free energy drinks offer sweetness without calories, making them popular with those managing weight or blood sugar. But do they truly support long-term health and fitness goals?</p>
    <h3>What's in a Zero-Calorie Drink?</h3>
    <p>These drinks typically contain artificial or non-nutritive sweeteners such as aspartame, sucralose, or stevia. While they mimic sugar's taste, they do not contribute calories or nutrients.</p>
    <h3>Weight Loss and Appetite</h3>
    <p>The research is mixed. Some studies show they help reduce calorie intake. Others suggest they may stimulate appetite, causing people to eat more later. The disconnect between sweetness and actual calories can confuse the brain's hunger signals.</p>
    <h3>Impact on Training</h3>
    <p>Zero-calorie drinks do not provide energy, so they are not ideal as pre-workout fuel. However, unless they are heavily caffeinated, they typically do not negatively affect hydration.</p>
    <h3>Gut Health and Cravings</h3>
    <p>Artificial sweeteners may affect gut microbiota or increase cravings for sweet foods in some individuals. Effects vary depending on the specific sweetener and the individual’s gut makeup.</p>
    <h3>When They Make Sense</h3>
    <p>They can be useful if you're replacing high-calorie sodas, trying to reduce sugar intake, or managing diabetes. Moderate use can help manage cravings while staying in a calorie deficit.</p>
    <h3>When to Be Cautious</h3>
    <p>If you rely on them too often, experience bloating, or find yourself constantly craving sweets, it may be time to cut back. They should not replace water or whole-food nutrition.</p>
    <h3>Final Verdict</h3>
    <p>Zero-calorie drinks are not inherently harmful, but they should not be overused. As with most things in nutrition, balance is key. If they help you stay consistent without causing issues, they can fit into a healthy lifestyle.</p>
    """,
    author,
    nutritionCategory,
    Set.of(tagWellness),
    "photo_8.png"
);

createPostIfNotExists(postRepository,
        "Fitness Scams: Don’t Fall for False Promises",
        """
        <p>In today’s digital fitness economy, scams are more sophisticated than ever. From “fat-burning teas” to “14-day ab challenges,” false promises lure millions into spending money and energy on ineffective — sometimes dangerous — products or programs. If you've ever felt overwhelmed or tricked, you’re not alone.</p>
        <h3>1. Why Fitness Scams Work</h3>
        <p>Fitness scams thrive because they tap into human psychology — our desire for instant results, low effort, and high payoff. Many people feel stuck in their fitness journey, frustrated by slow progress. Scammers sell a shortcut to that frustration.</p>
        <ul>
                <li>✖️ Unrealistic promises: “Lose 10 kg in 7 days — no workout required!”</li>
                <li>✖️ Fake urgency: “Only 3 hours left! This offer disappears tonight.”</li>
                <li>✖️ Social proof: Fake reviews, before/after photos, or celebrity endorsements.</li>
                <li>✖️ Fear-based marketing: “Your belly fat is killing you slowly…”</li>
        </ul>
        <h3>2. Common Scam Formats</h3>
        <h4>Miracle Supplements</h4>
        <p>Products claiming to “melt fat” or “block carbs” often lack any scientific evidence. Many contain unsafe stimulants or misleading labels.</p>
        <blockquote>🚩 <strong>Red flag:</strong> They avoid mentioning actual ingredients or cite vague studies with no sources.</blockquote>
        <h4>“No Effort” Training Plans</h4>
        <p>If a plan promises a beach body in two weeks with “only 5 minutes a day,” walk away. Real results require progressive overload, good recovery, and consistency.</p>
        <blockquote>🚩 <strong>Red flag:</strong> No mention of form, progression, or customization to your body.</blockquote>
        <h4>Fake Personal Trainers or Influencers</h4>
        <p>Some influencers promote products they don’t use, backed by financial incentives. Just because someone has abs doesn’t mean they know exercise science.</p>
        <blockquote>🚩 <strong>Red flag:</strong> No credentials, testimonials sound scripted, or bio says nothing about training experience.</blockquote>
        <h4>Detoxes & Cleanses</h4>
        <p>“Detox” is a marketing term, not a medical one. Your liver and kidneys detox your body — teas and juices don’t do that job better.</p>
        <blockquote>🚩 <strong>Red flag:</strong> They use the word “cleanse” as a solution to weight loss.</blockquote>
        <h3>3. Real-World Examples</h3>
        <ul>
                <li>A well-known “flat tummy tea” was sued for false advertising after customers reported side effects and no measurable fat loss.</li>
                <li>Some “online coaches” plagiarize workout plans and mass-sell them with zero customization — often without refunds or support.</li>
        </ul>
        <h3>4. How to Protect Yourself</h3>
        <ul>
                <li><strong>Is it evidence-based?</strong> Look for peer-reviewed studies or certifications.</li>
                <li><strong>Are the claims specific?</strong> Vague promises = red flags.</li>
                <li><strong>Is the offer pressuring you?</strong> Real coaches don’t use fear or fake urgency.</li>
                <li><strong>Who is behind this?</strong> Look them up. Verify credentials.</li>
        </ul>
        <h3>5. What Honest Fitness Looks Like</h3>
        <ul>
                <li>Realistic expectations (0.5–1 kg loss/week)</li>
                <li>Personalized plans</li>
                <li>Long-term habit building (training, sleep, stress)</li>
                <li>Help navigating setbacks</li>
        </ul>
        <h3>Final Thoughts</h3>
        <p>The fitness industry isn’t broken — but it’s noisy. Scams prey on your hopes, then blame you when results don’t come. Educate yourself, ask questions, and never buy based on emotion alone.</p>
        <p><strong>Remember:</strong> If it sounds too good to be true, it probably is. Trust consistency over hype — and build a stronger body and mindset the right way.</p>
        """,
        author,
        mythsCategory,
        Set.of(tagFitnessMyths),
        "photo_9.png"
);



        };
    }

    private void updateExistingPostPhotos(PostRepository postRepository) {
        System.out.println("Updating existing post photo paths...");
        
        // Map of title to correct photo filename
        var photoMappings = java.util.Map.of(
            "The Science of Snacking: Healthy Choices for Busy People", "photo_1.png",
            "Gut Feeling: How Your Microbiome Impacts Mood, Weight & Health", "photo_2.png",
            "Plant-Based but Powerful: Meeting Your Protein Needs Without Meat", "photo_6.png",
            "Decoding Food Labels: What They Say, What They Mean, and What to Ignore", "photo_4.png",
            "What Shoes's should You Be Lifting In?", "photo_3.png"
        );
        
        postRepository.findAll().forEach(post -> {
            if (photoMappings.containsKey(post.getTitle())) {
                String correctPhoto = photoMappings.get(post.getTitle());
                if (!correctPhoto.equals(post.getPhoto())) {
                    post.setPhoto(correctPhoto);
                    postRepository.save(post);
                    System.out.println("Updated photo for: " + post.getTitle() + " -> " + correctPhoto);
                }
            }
        });
    }

    private void createPostIfNotExists(
            PostRepository postRepository,
            String title,
            String content,
            User author,
            Category category,
            Set<Tag> tags,
            String photoPath
    ) {
        boolean exists = postRepository.findAll().stream()
                .anyMatch(post -> post.getTitle().equalsIgnoreCase(title));

        if (!exists) {
            Post post = Post.builder()
                    .title(title)
                    .content(content)
                    .status(PostStatus.PUBLISHED)
                    .readingTime(5)
                    .author(author)
                    .category(category)
                    .tags(tags)
                    .photo(photoPath)
                    .build();
            postRepository.save(post);
            System.out.println("Post created: " + title);
        } else {
            System.out.println("Post already exists: " + title);
        }
    }


}
