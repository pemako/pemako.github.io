---
layout: post
title: vim 开发环境部署
keywords: vim,development
category: vim
tags: [vim]
---

1. 先上线自己的`.vimrc` 配置信息

```
set nocompatible
filetype off
" set the runtime path to include Vundle and inititalize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'
Plugin 'scrooloose/nerdTree'
Plugin 'scrooloose/nerdcommenter'
Plugin 'suan/vim-instant-markdown'
Plugin 'Yggdroot/indentLine'
Plugin 'Lokaltog/vim-powerline'
Plugin 'jiangmiao/auto-pairs'
Plugin 'tell-k/vim-autopep8'
Plugin 'kien/ctrlp.vim'
Plugin 'fatih/vim-go'
Plugin 'tpope/vim-fugitive'
Plugin 'majutsushi/tagbar'
Plugin 'Valloric/YouCompleteMe'
Plugin 'elzr/vim-json'
Plugin 'vimwiki/vimwiki'
Plugin 'dhruvasagar/vim-table-mode'
" Plugin 'Raimondi/delimitMate'
" Plugin 'Chiel92/vim-autoformat'
" vim8 异步语法检查
" Plugin 'w0rp/ale'
call vundle#end()

set number
syntax on

set ts=4
set expandtab
set tabstop=4
set shiftwidth=4
set softtabstop=4
filetype indent plugin on

" 高亮当前行
set cursorline
" 高亮搜索结果
set hlsearch
colorscheme desert


" Nerdtree set
let NERDTreeIgnore=['\~$', '\.pyc$', '\.swp$', '__pycache__$']

"缩进指示线"
let g:indentLine_color_term = 239
let g:indentLine_char='┆'
let g:indentLine_enabled = 1
let g:indentLine_concealcursor = 'inc'
let g:indentLine_conceallevel = 2

"autopep8设置"
let g:autopep8_disable_show_diff=1
" 解决delete 键失效
set backspace=indent,eol,start
" 代码折叠设置
set foldmethod=indent
set foldlevel=99

" 定义快捷键的前缀，即 <Leader>
let mapleader=";"
" 设置tagbartoggle 的快捷键
nnoremap <Leader>n :NERDTree<CR>
nnoremap <Leader>p :TagbarToggle<CR>
nnoremap <Leader>pp :w !python<CR>

"-----------------
" 自动补全相关配置

" YCM 集成 OmniCppComplete 补全引擎，设置其快捷键
inoremap <leader>; <C-x><C-o>
" 补全内容不以分割子窗口形式出现，只显示补全列表
set completeopt-=preview
"默认配置文件路径"
"let g:ycm_global_ycm_extra_conf = '~/.ycm_extra_conf.py'
"打开vim时不再询问是否加载ycm_extra_conf.py配置"
let g:ycm_confirm_extra_conf=0
set completeopt=longest,menu
"python解释器路径"
let g:ycm_path_to_python_interpreter='/usr/local/bin/python3'
"是否开启语义补全"
let g:ycm_seed_identifiers_with_syntax=1
"是否在注释中也开启补全"
let g:ycm_complete_in_comments=1
let g:ycm_collect_identifiers_from_comments_and_strings = 0
"开始补全的字符数"
let g:ycm_min_num_of_chars_for_completion=2
"补全后自动关机预览窗口"
let g:ycm_autoclose_preview_window_after_completion=1
" 禁止缓存匹配项,每次都重新生成匹配项"
let g:ycm_cache_omnifunc=0
" 开启 YCM 标签补全引擎
let g:ycm_collect_identifiers_from_tags_files=1
"字符串中也开启补全"
let g:ycm_complete_in_strings = 1
"离开插入模式后自动关闭预览窗口"
autocmd InsertLeave * if pumvisible() == 0|pclose|endif


function HeaderPython()
    call setline(1, '# -*- coding:utf-8 -*-')
    call append(1, '# '.strftime('%Y-%m-%d %T', localtime()))
    normal G
    normal o
    normal o
endf

autocmd bufnewfile *.py call HeaderPython()

" 关于vim table model 插件的配置
let g:table_mode_corner='|'
" 默认情况下快速激活命令 <Leader>tm<>
" Delete Row <Leader>tdd
" Delete Column <Leader>tdc
" 使用公式相关
" Table Formulas <Leader>tfa
" tfa 激活公式输入，如果数据修改激活tfe 会重新计算
" 更多内容参考 https://github.com/dhruvasagar/vim-table-mode
```
