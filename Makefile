.PHONY: help serve build new clean deploy

HUGO       := hugo
CONTENT    := content
BUILD_DIR  := public
SERVER_URL := http://localhost:1313

help: ## 显示帮助信息
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n\nTargets:\n"} \
	  /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

serve: ## 启动本地开发服务器（含草稿）
	$(HUGO) server -D --disableFastRender

build: ## 构建静态文件到 $(BUILD_DIR)/
	$(HUGO) --minify

new: ## 新建文章，用法: make new PATH=posts/my-article.md
ifndef PATH
	$(error 请指定文章路径，例如: make new PATH=posts/my-article.md)
endif
	$(HUGO) new $(CONTENT)/$(PATH)

clean: ## 删除构建产物
	rm -rf $(BUILD_DIR)

deploy: build ## 构建并推送到 GitHub Pages
	cd $(BUILD_DIR) && \
	  git add -A && \
	  git commit -m "deploy: $$(date '+%Y-%m-%d %H:%M:%S')" && \
	  git push
