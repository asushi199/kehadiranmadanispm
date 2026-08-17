# Kehadiran SPM — Karnival Pendidikan Madani

Gerai **Sektor Pembangunan Murid (SPM)** 的出席登记系统。访客填写姓名和身份；摊位电视即时显示人数和分类图。

## 三个网址

| 网址 | 用途 |
| --- | --- |
| `/` | 登记表（印 QR 用这个） |
| `/papan` | 电视大屏 |
| `/admin` | 同事查看记录、下载 Excel/CSV |

## 在电脑上先试

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000  
还没接云数据库时，记录会暂存在 `data/kehadiran.json`。

本地管理员 PIN：把 `.env.example` 复制为 `.env.local`，再改 `ADMIN_PIN`。

## 部署到云端（Vercel + Turso）

1. 在 [Turso](https://turso.tech) 免费建一个数据库：Create database，复制 URL，再创建一个 token。
2. 把这个项目推到 GitHub。
3. 在 [Vercel](https://vercel.com/new) 导入该仓库。
4. Vercel → Settings → Environment Variables 填入：

```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_PIN=改成同事才知道的PIN
```

5. 重新 Deploy。电视打开 `https://你的域名.vercel.app/papan`，按 F11 或页面上的 **Skrin penuh**。电视上的 QR 会指向登记页。

数据表会在第一条记录写入时自动创建。
