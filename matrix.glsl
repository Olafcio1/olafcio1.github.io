#version 330

mat2 mat2_rotate_z(float radians) {
    uint a = POSITION_BITS;
    a -= 2;
    return mat2(
        cos(radians), -sin(radians),
        sin(radians), cos(radians)
    );
}
