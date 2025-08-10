package com.shop.service;

import com.shop.dto.CategoryDto;
import com.shop.entity.Category;
import com.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryDto::from)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + id));
        return CategoryDto.from(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리명입니다: " + categoryDto.getName());
        }

        Category category = Category.builder()
                .name(categoryDto.getName())
                .description(categoryDto.getDescription())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return CategoryDto.from(savedCategory);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + id));

        // 이름이 변경되었고, 다른 카테고리에서 이미 사용 중인지 확인
        if (!category.getName().equals(categoryDto.getName()) && 
            categoryRepository.existsByName(categoryDto.getName())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리명입니다: " + categoryDto.getName());
        }

        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());

        Category savedCategory = categoryRepository.save(category);
        return CategoryDto.from(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다: " + id));

        if (!category.getProducts().isEmpty()) {
            throw new IllegalStateException("상품이 등록된 카테고리는 삭제할 수 없습니다.");
        }

        categoryRepository.deleteById(id);
    }
} 