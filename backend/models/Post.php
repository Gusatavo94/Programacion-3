<?php

class Post {
    public ?int $id;
    public int $user_id;
    public string $title;
    public string $content;
    public string $image;
    public string $category;

    public function __construct(?int $id, int $user_id, string $title, string $content, string $image, string $category) {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->title = $title;
        $this->content = $content;
        $this->image = $image;
        $this->category = $category;
    }
}