const sections = {
  bangcap: {
    title: "Danh mục Bằng cấp",
    fields: [
      { label: "Tên đầy đủ", name: "ten", type: "text" },
      { label: "Tên viết tắt", name: "viettat", type: "text" },
    ],
  },
  khoa: {
    title: "Danh mục Khoa",
    fields: [
      { label: "Tên đầy đủ", name: "ten", type: "text" },
      { label: "Tên viết tắt", name: "viettat", type: "text" },
      { label: "Mô tả nhiệm vụ", name: "mota", type: "textarea" },
    ],
  },
  giaovien: {
    title: "Danh sách Giáo viên",
    fields: [
      { label: "Mã số", name: "maso", type: "text" },
      { label: "Họ tên", name: "hoten", type: "text" },
      { label: "Ngày sinh", name: "ngaysinh", type: "date" },
      { label: "Điện thoại", name: "dienthoai", type: "text" },
      { label: "Email", name: "email", type: "email" },
      { label: "Thuộc khoa", name: "khoa", type: "text" },
      { label: "Bằng cấp", name: "bangcap", type: "text" },
    ],
  },
  hocphan: {
    title: "Danh sách Học phần",
    fields: [
      { label: "Mã học phần", name: "ma", type: "text" },
      { label: "Tên học phần", name: "ten", type: "text" },
      { label: "Số tín chỉ", name: "tinchi", type: "number" },
      { label: "Hệ số học phần", name: "hesohp", type: "float" },
      { label: "Số tiết", name: "sotiet", type: "number" },
    ],
  },
  kihoc: {
    title: "Kỳ học / Năm học",
    fields: [
      {
        label: "Tên kỳ",
        name: "tenky",
        type: "dropdown",
        options: ["HK1", "HK2", "HK3"],
      },
      { label: "Năm học", name: "namhoc", type: "text" },
      { label: "Ngày bắt đầu", name: "batdau", type: "date" },
      { label: "Ngày kết thúc", name: "ketthuc", type: "date" },
    ],
  },
  lophocphan: {
    title: "Danh sách Lớp học phần",
    fields: [
      { label: "Kỳ học", name: "kihoc", type: "dropdown" },
      { label: "Học phần", name: "hocphan", type: "dropdown" },
      { label: "Mã lớp", name: "malop", type: "text" },
      { label: "Tên lớp", name: "tenlop", type: "text" },
      { label: "Số SV", name: "sosv", type: "number" },
      { label: "Số lượng lớp mở", name: "soluonglop", type: "number" },
    ],
  },
  phancong: {
    title: "Phân công giảng viên",
    fields: [
      { label: "Kỳ học", name: "kihoc", type: "dropdown" },
      { label: "Lớp học phần", name: "lophocphan", type: "dropdown" },
      { label: "Giảng viên", name: "giaovien", type: "dropdown" },
    ],
  },
  dinhmuctien: {
    title: "Định mức tiền theo tiết",
    fields: [
      { label: "Mức tiền mỗi tiết (VNĐ)", name: "muctien", type: "number" },
    ],
  },
  hesogiaovien: {
    title: "Hệ số giáo viên theo bằng cấp",
    fields: [
      { label: "Bằng cấp", name: "bangcap", type: "dropdown" },
      { label: "Hệ số", name: "heso", type: "float" },
    ],
  },
  hesolop: {
    title: "Hệ số lớp học phần",
    fields: [
      { label: "Từ số SV", name: "tu", type: "number" },
      { label: "Đến số SV", name: "den", type: "number" },
      { label: "Hệ số", name: "heso", type: "float" },
    ],
  },
  tinhtienday: {
    title: "Kết quả tính tiền dạy",
    fields: [
      { label: "Kỳ học", name: "kihoc", type: "dropdown" },
      { label: "Giảng viên", name: "giaovien", type: "dropdown" },
      {
        label: "Tiền dạy (VNĐ)",
        name: "tienday",
        type: "number",
      },
    ],
  },
};

//Hàm hiển thị
function showSection(id) {
  const container = document.getElementById("mainSection");
  mainSection.innerHTML = "";

  // Nếu là phần thống kê giáo viên
  if (id === "thongke_giaovien") {
    container.innerHTML = `
      <h3>Thống kê giáo viên theo khoa</h3>
      <canvas id="giaovienChart" height="100"></canvas>
    `;
    setTimeout(() => {
      renderGiaovienChart(); // Đợi DOM cập nhật xong mới vẽ biểu đồ
    }, 10);
    return;
  }
  // Nếu là phần thống kê lớp học phần theo kỳ học
  if (id === "thongke_lophocphan") {
    container.innerHTML = `
    <h3>Thống kê lớp học phần theo kỳ học</h3>
    <canvas id="lophocphanChart" height="100"></canvas>
  `;
    setTimeout(() => {
      renderLophocphanChart(); // Đợi DOM cập nhật xong mới vẽ biểu đồ
    }, 10);
    return;
  }

  const section = sections[id];
  if (!section) {
    container.innerHTML = `<h3>Đang cập nhật...</h3>`;
    return;
  }

  const list = JSON.parse(localStorage.getItem(id)) || [];

  // Phần HTML chính
  let html = `
  <h3>${section.title}</h3>
  <button class="btn btn-primary mb-2" onclick="openModal('${id}')">Thêm mới</button>
  <input type="text" class="form-control mb-2" placeholder="Tìm kiếm..." onkeyup="searchData(this, '${id}')">
  <table class="table table-bordered align-middle">
    <thead>
      <tr>
        ${section.fields.map((f) => `<th>${f.label}</th>`).join("")}
        <th style="width:120px;">Hành động</th>
      </tr>
    </thead>
    <tbody id="table-${id}">
      ${renderRows(list, section.fields, id)}
    </tbody>
  </table>
`;

  container.innerHTML = html;
}

function toggleSubmenu(menuId) {
  const menu = document.getElementById(menuId);
  menu.classList.toggle("show");
}

// Hàm render bảng
function renderRows(data, fields, sectionId) {
  if (data.length === 0) {
    const colspan = fields.length + 1;
    return `<tr><td colspan="${colspan}" class="text-center">Không có dữ liệu</td></tr>`;
  }

  return data
    .map((item, index) => {
      const rowContent = fields
        .map((f) => {
          let value = item[f.name] || "";

          // 👉 Xử lý riêng cho phần "tinhtienday"
          if (sectionId === "tinhtienday") {
            if (f.name === "giaovien") {
              const gvList = JSON.parse(localStorage.getItem("giaovien")) || [];
              const gv = gvList.find((g) => g.maso === value);
              value = gv ? gv.hoten : value; // Hiện họ tên nếu tìm thấy
            }

            if (f.name === "kihoc") {
              const kihocList = JSON.parse(localStorage.getItem("kihoc")) || [];
              const kh = kihocList.find(
                (k) => (k.id || `${k.tenky}-${k.namhoc}`) === value
              );
              value = kh ? `${kh.tenky} (${kh.namhoc})` : value;
            }
          }

          return `<td>${value}</td>`;
        })
        .join("");

      return `
        <tr>
          ${rowContent}
          <td class="text-center">
            <button class="btn btn-sm btn-warning me-1" onclick="editItem('${sectionId}', ${index})">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteItem('${sectionId}', ${index})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

//Hàm xóa
function deleteItem(id, index) {
  const list = JSON.parse(localStorage.getItem(id)) || [];

  if (index < 0 || index >= list.length) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Bản ghi không hợp lệ hoặc đã bị xóa!",
    });
    return;
  }

  // Dùng SweetAlert để xác nhận
  Swal.fire({
    title: "Xác nhận xóa",
    text: "Bạn có chắc muốn xóa bản ghi này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      // Xóa bản ghi
      list.splice(index, 1);
      localStorage.setItem(id, JSON.stringify(list));
      showSection(id); // Cập nhật giao diện

      Swal.fire({
        icon: "success",
        title: "Đã xóa!",
        text: "Bản ghi đã được xóa thành công.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

//Hàm mở Modal
function openModal(id) {
  const fields = sections[id].fields;
  const form = document.getElementById("modalFormFields");

  const khoaList = JSON.parse(localStorage.getItem("khoa")) || [];
  const bangcapList = JSON.parse(localStorage.getItem("bangcap")) || [];

  form.innerHTML = fields
    .map((f) => {
      // --- Dropdown cố định (có f.options) ---
      if (f.type === "dropdown" && Array.isArray(f.options)) {
        const options = f.options
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join("");
        return `
    <div class="mb-3">
      <label class="form-label">${f.label}</label>
      <select class="form-select" name="${f.name}" required>${options}</select>
    </div>
  `;
      }

      // --- Giáo viên: chọn khoa, bằng cấp ---
      if (id === "giaovien" && (f.name === "khoa" || f.name === "bangcap")) {
        const options =
          (f.name === "khoa" ? khoaList : bangcapList)
            .map((item) => {
              const label = `${item.ten} (${item.viettat})`;
              return `<option value="${item.ten}">${label}</option>`;
            })
            .join("") || `<option value="">Chưa có dữ liệu</option>`;
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" required>${options}</select>
          </div>
        `;
      }

      // --- Lớp học phần: chọn kỳ học, học phần + nhập số lượng lớp ---
      if (id === "lophocphan" && (f.name === "kihoc" || f.name === "hocphan")) {
        const listData = JSON.parse(localStorage.getItem(f.name)) || [];
        const options =
          listData
            .map((item) => {
              if (f.name === "kihoc") {
                const value = item.id || `${item.tenky}-${item.namhoc}`;
                const label = `${item.tenky} (${item.namhoc || ""})`;
                return `<option value="${value}">${label}</option>`;
              } else if (f.name === "hocphan") {
                const value = item.ten || item.name || "";
                const label = item.ten || item.name || "";
                return `<option value="${value}">${label}</option>`;
              }
              return "";
            })
            .join("") || `<option value="">Chưa có dữ liệu</option>`;
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" required>${options}</select>
          </div>
        `;
      }

      // --- Phân công: chọn theo kỳ học thì lọc lớp học phần ---
      if (
        id === "phancong" &&
        (f.name === "lophocphan" || f.name === "giaovien" || f.name === "kihoc")
      ) {
        let listData = [];
        if (f.name === "lophocphan") {
          listData = JSON.parse(localStorage.getItem("lophocphan")) || [];
        } else if (f.name === "giaovien") {
          listData = JSON.parse(localStorage.getItem("giaovien")) || [];
        } else if (f.name === "kihoc") {
          listData = JSON.parse(localStorage.getItem("kihoc")) || [];
        }

        const options =
          listData.length > 0
            ? listData
                .map((item) => {
                  if (f.name === "lophocphan") {
                    return `<option value="${item.malop}">${item.malop} - ${item.tenlop} (${item.hocphan})</option>`;
                  } else if (f.name === "giaovien") {
                    return `<option value="${item.hoten}">${item.hoten} (${item.maso})</option>`;
                  } else if (f.name === "kihoc") {
                    const value = item.id || `${item.tenky}-${item.namhoc}`;
                    const label = `${item.tenky} (${item.namhoc || ""})`;
                    return `<option value="${value}">${label}</option>`;
                  }
                })
                .join("")
            : `<option value="">Chưa có dữ liệu</option>`;

        const selectId = f.name === "lophocphan" ? 'id="selectLopHocPhan"' : "";
        const onchange =
          f.name === "kihoc"
            ? 'onchange="filterLopHocPhanByKiHoc(this.value)"'
            : "";

        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" ${selectId} ${onchange} required>${options}</select>
          </div>
        `;
      }

      if (f.name === "soluonglop" && id === "lophocphan") {
        return `
          <div class="mb-3">
            <label class="form-label">Số lượng lớp (1 - 50)</label>
            <input type="number" class="form-control" name="soluonglop" min="1" max="50" required />
          </div>
        `;
      }

      // Gọi filter khi mở modal phân công
      if (id === "phancong") {
        const firstKiHoc = document.querySelector(
          "select[name='kihoc']"
        )?.value;
        if (firstKiHoc) {
          filterLopHocPhanByKiHoc(firstKiHoc);
        }
      }

      //Tính tiền dạy
      if (
        id === "tinhtienday" &&
        (f.name === "kihoc" || f.name === "giaovien")
      ) {
        let listData = [];
        if (f.name === "kihoc")
          listData = JSON.parse(localStorage.getItem("kihoc")) || [];
        if (f.name === "giaovien")
          listData = JSON.parse(localStorage.getItem("giaovien")) || [];

        const options =
          listData.length > 0
            ? listData
                .map((item) => {
                  if (f.name === "kihoc") {
                    const value = `${item.tenky}-${item.namhoc}`;
                    const label = `${item.tenky} (${item.namhoc})`;
                    return `<option value="${value}">${label}</option>`;
                  } else {
                    return `<option value="${item.hoten}">${item.hoten} (${item.maso})</option>`;
                  }
                })
                .join("")
            : `<option value="">Chưa có dữ liệu</option>`;

        const onchange =
          f.name === "giaovien" || f.name === "kihoc"
            ? 'onchange="tinhTienDay()"'
            : "";

        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" ${onchange} required>${options}</select>
          </div>
        `;
      }

      if (id === "tinhtienday" && f.name === "tienday") {
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <input type="number" class="form-control" name="${f.name}" id="tiendayInput" readonly />
          </div>
        `;
      }

      if (f.type === "textarea") {
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <textarea class="form-control" name="${f.name}" required></textarea>
          </div>
        `;
      }

      return `
        <div class="mb-3">
          <label class="form-label">${f.label}</label>
          <input type="${f.type}" class="form-control" name="${f.name}" required />
        </div>
      `;
    })
    .join("");

  const formEl = document.getElementById("modalContentForm");

  formEl.onsubmit = function (e) {
    e.preventDefault();
    const data = {};
    new FormData(this).forEach((v, k) => (data[k] = v.trim()));

    const errorMsg = validateFormData(id, data);
    if (errorMsg) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMsg,
      });
      return;
    }

    const list = JSON.parse(localStorage.getItem(id)) || [];

    if (id === "lophocphan") {
      const soluong = parseInt(data.soluonglop);
      if (isNaN(soluong) || soluong < 1 || soluong > 50) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Số lượng lớp phải từ 1 đến 50!",
        });
        return;
      }

      for (let i = 1; i <= soluong; i++) {
        const newItem = {
          kihoc: data.kihoc,
          hocphan: data.hocphan,
          malop: `${data.malop}_${i}`,
          tenlop: `${data.tenlop} ${i}`,
          sosv: data.sosv,
          soluonglop: data.soluonglop,
        };
        list.push(newItem);
      }
    } else if (id === "phancong") {
      const newItem = {
        kihoc: data.kihoc,
        lophocphan: data.lophocphan,
        giaovien: data.giaovien,
      };

      // Kiểm tra trùng phân công
      const exists = list.some(
        (item) =>
          item.kihoc === newItem.kihoc &&
          item.lophocphan === newItem.lophocphan &&
          item.giaovien === newItem.giaovien
      );

      if (exists) {
        Swal.fire({
          icon: "warning",
          title: "Trùng dữ liệu",
          text: "Giảng viên đã được phân công lớp học phần này trong kỳ học này.",
        });
        return;
      }

      list.push(newItem);
    }

    if (id === "tinhtienday") {
      list.push(data); // bạn có thể thêm thông tin giáo viên, lớp, kỳ nếu cần
    } else {
      list.push(data);
    }

    localStorage.setItem(id, JSON.stringify(list));
    showSection(id);
    bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
  };
  new bootstrap.Modal(document.getElementById("modalForm")).show();
}

function tinhTienDay() {
  const kihoc = document.querySelector("select[name='kihoc']")?.value;
  const giaovien = document.querySelector("select[name='giaovien']")?.value;
  if (!kihoc || !giaovien) return;

  const [phancong, lophp, hocphan, hesolop, hsgv, dmTien] = [
    "phancong",
    "lophocphan",
    "hocphan",
    "hesolop",
    "hesogiaovien",
    "dinhmuctien",
  ].map((key) => JSON.parse(localStorage.getItem(key)) || []);

  const gvien = JSON.parse(localStorage.getItem("giaovien"))?.find(
    (gv) => gv.hoten === giaovien
  );
  const heSoGV = hsgv.find((h) => h.bangcap === gvien?.bangcap)?.heso || 1;
  const mucTien = dmTien[0]?.muctien || 0;

  const lopDay = phancong
    .filter((p) => p.kihoc === kihoc && p.giaovien === giaovien)
    .map((p) => lophp.find((l) => l.malop === p.lophocphan))
    .filter(Boolean);

  let total = 0;

  lopDay.forEach((lop) => {
    const hp = hocphan.find((h) => h.ten === lop.hocphan);
    const soTiet = parseFloat(hp?.sotiet || 0);
    const heSoHP = parseFloat(hp?.hesohp || 1);
    const soSV = parseInt(lop?.sosv || 0);

    const heSoLop =
      hesolop.find((h) => soSV >= h.tu && soSV <= h.den)?.heso || 1;

    total += soTiet * heSoHP * heSoLop * heSoGV * mucTien;
  });

  document.getElementById("tiendayInput").value = Math.round(total);
}

//Hàm sửa Modal
function editItem(id, index) {
  const list = JSON.parse(localStorage.getItem(id)) || [];
  const item = list[index];
  if (!item) return alert("Dữ liệu không tồn tại");

  const fields = sections[id].fields;
  const form = document.getElementById("modalFormFields");

  const khoaList = JSON.parse(localStorage.getItem("khoa")) || [];
  const bangcapList = JSON.parse(localStorage.getItem("bangcap")) || [];

  form.innerHTML = fields
    .map((f) => {
      const value = item[f.name] || "";

      if (id === "giaovien" && (f.name === "khoa" || f.name === "bangcap")) {
        const options =
          (f.name === "khoa" ? khoaList : bangcapList)
            .map((opt) => {
              const label = `${opt.ten} (${opt.viettat})`;
              const selected = opt.ten === value ? "selected" : "";
              return `<option value="${opt.ten}" ${selected}>${label}</option>`;
            })
            .join("") || `<option value="">Chưa có dữ liệu</option>`;
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" required>${options}</select>
          </div>
        `;
      }

      if (id === "lophocphan" && (f.name === "kihoc" || f.name === "hocphan")) {
        const listData = JSON.parse(localStorage.getItem(f.name)) || [];
        const options =
          listData
            .map((opt) => {
              // Tạo value và label giống phần thêm mới: value là id hoặc tenky-namhoc, label là tenky (namhoc)
              let optionValue, optionLabel;
              if (f.name === "kihoc") {
                optionValue = opt.id || `${opt.tenky}-${opt.namhoc}`;
                optionLabel = `${opt.tenky} (${opt.namhoc || ""})`;
              } else {
                optionValue = opt.ten || opt.name || "";
                optionLabel = opt.ten || opt.name || "";
              }

              const selected = optionValue === value ? "selected" : "";
              return `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
            })
            .join("") || `<option value="">Chưa có dữ liệu</option>`;
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" required>${options}</select>
          </div>
        `;
      }

      if (
        id === "phancong" &&
        (f.name === "lophocphan" || f.name === "giaovien" || f.name === "kihoc")
      ) {
        let listData = [];
        if (f.name === "lophocphan") {
          listData = JSON.parse(localStorage.getItem("lophocphan")) || [];
        } else if (f.name === "giaovien") {
          listData = JSON.parse(localStorage.getItem("giaovien")) || [];
        } else if (f.name === "kihoc") {
          listData = JSON.parse(localStorage.getItem("kihoc")) || [];
        }

        const options =
          listData
            .map((item2) => {
              let optionLabel = "",
                optionValue = "",
                selected = "";

              if (f.name === "lophocphan") {
                optionValue = item2.malop;
                optionLabel = `${item2.malop} - ${item2.tenlop} (${item2.hocphan})`;
              } else if (f.name === "giaovien") {
                optionValue = item2.hoten;
                optionLabel = `${item2.hoten} (${item2.maso})`;
              } else if (f.name === "kihoc") {
                optionValue = item2.id || `${item2.tenky}-${item2.namhoc}`;
                optionLabel = `${item2.tenky} (${item2.namhoc || ""})`;
              }

              // Gán selected nếu giá trị khớp với value đang truyền
              selected = optionValue === value ? "selected" : "";

              return `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
            })
            .join("") || `<option value="">Chưa có dữ liệu</option>`;

        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <select class="form-select" name="${f.name}" required>${options}</select>
          </div>
        `;
      }

      if (f.type === "textarea") {
        return `
          <div class="mb-3">
            <label class="form-label">${f.label}</label>
            <textarea class="form-control" name="${f.name}" required>${value}</textarea>
          </div>
        `;
      }

      return `
        <div class="mb-3">
          <label class="form-label">${f.label}</label>
          <input type="${f.type}" class="form-control" name="${f.name}" value="${value}" required />
        </div>
      `;
    })
    .join("");

  const formEl = document.getElementById("modalContentForm");
  formEl.onsubmit = function (e) {
    e.preventDefault();

    const data = {};
    new FormData(this).forEach((v, k) => (data[k] = v.trim()));

    // Bổ sung lại thông tin khi sửa phân công
    if (id === "phancong") {
      const lophocphans = JSON.parse(localStorage.getItem("lophocphan")) || [];
      const lop = lophocphans.find((l) => l.malop === data["lophocphan"]);
      if (lop) {
        data.lophocphan_ma = lop.malop;
        data.lophocphan_ten = lop.tenlop;
        data.hocphan = lop.hocphan;
      }
    }

    const errorMsg = validateFormData(id, data);
    if (errorMsg) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMsg,
      });
      return;
    }

    list[index] = data;
    localStorage.setItem(id, JSON.stringify(list));
    showSection(id);
    bootstrap.Modal.getInstance(document.getElementById("modalForm")).hide();
  };

  new bootstrap.Modal(document.getElementById("modalForm")).show();
}

// Hàm helper bỏ dấu tiếng Việt (nếu bạn muốn)
// Nếu không cần thì bỏ hàm này và gọi trực tiếp toLowerCase()
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function searchData(input, id) {
  const rawKeyword = input.value.trim().toLowerCase();
  if (!rawKeyword) {
    // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
    const allData = JSON.parse(localStorage.getItem(id)) || [];
    const fields = sections[id].fields;
    document.getElementById(`table-${id}`).innerHTML = renderRows(
      allData,
      fields
    );
    return;
  }

  // Tách từ khóa thành mảng từ (vd: "nguyen van" => ["nguyen", "van"])
  const keywords = rawKeyword.split(/\s+/).map(removeVietnameseTones);

  const allData = JSON.parse(localStorage.getItem(id)) || [];
  const fields = sections[id].fields;

  const filtered = allData.filter((item) => {
    // Tạo chuỗi chứa tất cả giá trị của item ở các trường fields, bỏ dấu và chuyển lowercase
    const searchableText = fields
      .map((f) => {
        const val = item[f.name];
        return val ? removeVietnameseTones(String(val).toLowerCase()) : "";
      })
      .join(" ");

    // Kiểm tra xem tất cả các từ khóa đều có trong searchableText
    return keywords.every((kw) => searchableText.includes(kw));
  });

  document.getElementById(`table-${id}`).innerHTML = renderRows(
    filtered,
    fields
  );
}

function validateFormData(id, data) {
  // Kiểm tra trống
  function validateFormData(id, data) {
    if (!data || typeof data !== "object") {
      return "Dữ liệu không hợp lệ.";
    }

    for (const key in data) {
      if (data[key] === "") {
        return `Vui lòng nhập đầy đủ thông tin. Trường "${key}" đang để trống.`;
      }
    }

    return null; // Không có lỗi
  }

  // Kiểm tra số âm với các trường type number
  const fields = sections[id].fields || [];
  for (const f of fields) {
    if (f.type === "number") {
      const value = Number(data[f.name]);
      if (isNaN(value)) {
        return `Trường "${f.label}" phải là số hợp lệ.`;
      }
      if (value < 0) {
        return `Trường "${f.label}" không được phép nhập số âm.`;
      }
    }
  }

  // Với phần "bangcap" kiểm tra không chứa số
  if (id === "bangcap") {
    if (/\d/.test(data["ten"])) {
      return 'Trường "Tên bằng cấp" không được chứa số.';
    }
    if (/\d/.test(data["viettat"])) {
      return 'Trường "Tên viết tắt" không được chứa số.';
    }
  }

  // Với phần "khoa" kiểm tra không chứa số
  if (id === "khoa") {
    if (/\d/.test(data["ten"])) {
      return 'Trường "Tên khoa" không được chứa số.';
    }
    if (/\d/.test(data["viettat"])) {
      return 'Trường "Tên viết tắt" không được chứa số.';
    }
  }

  // Với phần "giaovien"
  if (id === "giaovien") {
    const hoten = data["hoten"];
    const email = data["email"];
    const phone = data["dienthoai"];
    const maso = data["maso"];
    const ngaysinh = data["ngaysinh"];

    // Kiểm tra tên không chứa số
    if (/\d/.test(hoten)) {
      return 'Trường "Họ tên" không được chứa chữ số.';
    }

    // Kiểm tra định dạng email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Trường "Email" không hợp lệ.';
    }

    // Kiểm tra số điện thoại
    if (phone && !/^[0-9]{9,11}$/.test(phone)) {
      return 'Trường "Điện thoại" phải từ 9 đến 11 chữ số.';
    }

    // Kiểm tra tuổi > 35
    if (ngaysinh) {
      const birthDate = new Date(ngaysinh);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age <= 35) {
        return "Tuổi giáo viên phải lớn hơn 35.";
      }
    }

    // Kiểm tra trùng mã số
    const list = JSON.parse(localStorage.getItem("giaovien")) || [];
    const isDuplicate = list.some((gv) => gv.maso === maso);
    if (isDuplicate) {
      return `Mã số giáo viên "${maso}" đã tồn tại.`;
    }
  }
  // Với phần "hocphan"
  if (id === "hocphan") {
    // Kiểm tra tên học phần không chứa số
    if (/\d/.test(data["ten"])) {
      return "Tên học phần không được chứa số.";
    }

    // Kiểm tra trùng mã học phần
    const list = JSON.parse(localStorage.getItem("hocphan")) || [];
    const isDuplicate = list.some((hp) => hp.ma === data.ma);
    if (isDuplicate) {
      return `Mã học phần "${data.ma}" đã tồn tại.`;
    }
  }
  if (id === "kihoc") {
    const batdau = new Date(data.batdau);
    const ketthuc = new Date(data.ketthuc);
    const namhoc = data.namhoc;

    // Kiểm tra ngày kết thúc không trước ngày bắt đầu
    if (ketthuc < batdau) {
      return "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.";
    }

    // Kiểm tra kỳ học trong vòng 3 tháng (khoảng 92 ngày)
    const diffTime = ketthuc - batdau;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays > 92) {
      return "Kỳ học phải diễn ra trong vòng 3 tháng.";
    }

    // Xác định năm học theo tháng bắt đầu
    const year = batdau.getFullYear();
    const month = batdau.getMonth() + 1; // getMonth() trả về 0-11

    let expectedNamHoc;
    if (month < 9) {
      expectedNamHoc = year - 1 + "-" + year;
    } else {
      expectedNamHoc = year + "-" + (year + 1);
    }

    if (namhoc !== expectedNamHoc) {
      return `Năm học phải có dạng "${expectedNamHoc}" dựa theo ngày bắt đầu.`;
    }
  }

  //Kiểm tra phân công
  if (id === "phancong") {
    if (!data.lophocphan) return "Vui lòng chọn lớp học phần.";
    if (!data.giaovien) return "Vui lòng chọn giảng viên.";
  }
  return null; // Không có lỗi
}

function getLopInfo(maLop) {
  const list = JSON.parse(localStorage.getItem("lophocphan")) || [];
  const lop = list.find((l) => l.malop === maLop);
  return lop ? lop.tenlop : "N/A";
}

function getHocPhanInfo(maLop) {
  const list = JSON.parse(localStorage.getItem("lophocphan")) || [];
  const lop = list.find((l) => l.malop === maLop);
  return lop ? lop.hocphan : "N/A";
}

let giaovienChartInstance = null;

function renderGiaovienChart() {
  if (giaovienChartInstance) {
    giaovienChartInstance.destroy(); // Hủy biểu đồ cũ nếu có
  }

  const gvList = JSON.parse(localStorage.getItem("giaovien")) || [];
  const stats = {};

  gvList.forEach((gv) => {
    const khoa = gv.khoa || "Chưa rõ";
    stats[khoa] = (stats[khoa] || 0) + 1;
  });

  const labels = Object.keys(stats);
  const data = Object.values(stats);

  const ctx = document.getElementById("giaovienChart").getContext("2d");
  giaovienChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Số lượng giáo viên",
          data,
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(76, 175, 80, 0.7)",
            "rgba(255, 152, 0, 0.7)",
            "rgba(244, 67, 54, 0.7)",
            "rgba(156, 39, 176, 0.7)",
            "rgba(233, 30, 99, 0.7)",
            "rgba(255, 193, 7, 0.7)",
            "rgba(96, 125, 139, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Biểu đồ số lượng giáo viên theo khoa" },
      },
      scales: {
        y: { beginAtZero: true, precision: 0 },
      },
    },
  });
}
function renderLophocphanChart() {
  const list = JSON.parse(localStorage.getItem("lophocphan")) || [];

  // Đếm số lớp theo kỳ học (kihoc)
  const counts = {};
  list.forEach((item) => {
    const kihoc = item.kihoc || "Chưa xác định";
    counts[kihoc] = (counts[kihoc] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const ctx = document.getElementById("lophocphanChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Số lớp theo kỳ học",
          data: data,
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(76, 175, 80, 0.7)",
            "rgba(255, 152, 0, 0.7)",
            "rgba(244, 67, 54, 0.7)",
            "rgba(156, 39, 176, 0.7)",
            "rgba(233, 30, 99, 0.7)",
            "rgba(255, 193, 7, 0.7)",
            "rgba(96, 125, 139, 0.7)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, precision: 0 },
      },
    },
  });
}
