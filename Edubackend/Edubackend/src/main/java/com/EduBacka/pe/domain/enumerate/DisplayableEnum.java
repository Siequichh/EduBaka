package com.EduBacka.pe.domain.enumerate;

public interface DisplayableEnum {

    String getCode();
    String getDisplayName();
    boolean isAvailable();

    static <E extends Enum<E> & DisplayableEnum> E fromCode(Class<E> enumClass, String code) {
        for (E e : enumClass.getEnumConstants()) {
            if (e.getCode().equals(code) && e.isAvailable()) {
                return e;
            }
        }
        throw new IllegalArgumentException(
                "Código inválido para " + enumClass.getSimpleName() + ": " + code
        );
    }
}
