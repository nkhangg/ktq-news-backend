export class SystemLang {
  private static texts = {
    messages: {
      vi: {
        error: 'Đã xảy ra lỗi!',
        not_found: 'Không tìm thấy dữ liệu!',
        unauthorized: 'Bạn không có quyền truy cập!',
        forbidden: 'Truy cập bị từ chối!',
        success: 'Thành công!',
        server_error: 'Lỗi máy chủ, vui lòng thử lại sau!',
        connection_lost: 'Mất kết nối, kiểm tra lại mạng!',
        try_again: 'Vui lòng thử lại!',
        logout_success: 'Bạn đã đăng xuất thành công!',
        login_required: 'Vui lòng đăng nhập để tiếp tục!',
        save_success: 'Lưu thành công!',
        delete_success: 'Xóa thành công!',
        delete_failure: 'Xóa không thành công!',
        can_not_delete: 'Không thể xóa @key',
        no_data: 'Không có dữ liệu để hiển thị!',
        default_action: `Hành động này không thể thực hiện được!`,
        register_failure: 'Đăng ký tài khoản không thành công!',
        register_success: 'Đăng ký tài khoản thành công!',
        create_success: 'Đã tạo @key thành công!',
        create_failed: 'Không thể tạo @key!',
        update_success: 'Đã cập nhật @key thành công!',
        update_failed: 'Không thể cập nhật @key!',
        already_exists: '@key đã tồn tại!',
        required: '@key là bắt buộc!',
        invalid: '@key không hợp lệ!',
        no_permission: 'Bạn không có quyền thực hiện thao tác với @key!',
      },
      en: {
        error: 'An error occurred!',
        not_found: 'Data not found!',
        unauthorized: 'You are not authorized!',
        forbidden: 'Access denied!',
        success: 'Success!',
        server_error: 'Server error, please try again later!',
        connection_lost: 'Connection lost, check your network!',
        try_again: 'Please try again!',
        logout_success: 'You have successfully logged out!',
        login_required: 'Please log in to continue!',
        save_success: 'Saved successfully!',
        delete_success: 'Delete success!',
        delete_failure: 'Delete fail!',
        can_not_delete: "Can't delete @key",
        no_data: 'No data available!',
        default_action: `This action cannot be performed`,
        register_failure: 'Register account is fail!',
        register_success: 'Register account is success!',
        create_success: '@key created successfully!',
        create_failed: 'Failed to create @key!',
        update_success: '@key updated successfully!',
        update_failed: 'Failed to update @key!',
        already_exists: '@key already exists!',
        required: '@key is required!',
        invalid: '@key is invalid!',
        no_permission:
          'You do not have permission to perform this action on @key!',
      },
    },
  };

  // default lang is VIỆT NAM
  private static lang = process.env.PUBLIC_NEXT_LANG === 'en' ? 'en' : 'vi';

  /** ✅ Lấy text từ messages hoặc labels */
  static getText<T extends keyof typeof SystemLang.texts>(
    type: T,
    key: keyof (typeof SystemLang.texts)[T]['vi'],
    after?: string,
  ): string {
    const text: string = SystemLang.texts[type][SystemLang.lang][key];

    return after
      ? text.includes('@key')
        ? text.replaceAll('@key', after)
        : `${text} ${after}`
      : (text ?? `Missing ${type}: ${String(key)}`);
  }

  /** ✅ Trả về text từ custom object, fallback nếu không có */
  static getCustomText(
    texts: { vi?: string; en?: string },
    fallbackType: keyof typeof SystemLang.texts = 'messages',
  ): string {
    return (
      texts[SystemLang.lang] ||
      Object.values(texts)[0] ||
      SystemLang.getText(fallbackType, 'error')
    );
  }
}
