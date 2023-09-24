import { Reader, Writer } from 'skybitsky-common';
import {
    AccountDto,
    CategoryDto,
    PeriodDto,
    TransactionDto,
    TransactionCreateDto,
} from './Budget.types';
import { SBS_BUDGET_TRANSACTION } from '../../core/constants';

export interface BudgetInterface {
    getAccount(path: string): AccountDto | undefined;
    getPeriods(path: string): PeriodDto[];
    getPeriod(path: string): PeriodDto | undefined;
    getCategories(path: string): CategoryDto[];
    getCategory(path: string): CategoryDto | undefined;
    getTransactions(path: string, recursive?: boolean): TransactionDto[];
    getTransaction(path: string): TransactionDto | undefined;
    createTransactionPage(path: string, transaction: TransactionCreateDto): Promise<void>;
}

export class Budget implements BudgetInterface {
    constructor(
        protected reader: Reader,
        protected writer: Writer,
    ) {}

    getAccount(path: string): AccountDto | undefined {
        const page = this.reader.getPage(path);

        if (!page) {
            return undefined;
        }

        const name = Budget.getName(page);

        return {
            name,
            title: page.title ?? name,
            value: parseFloat(page.value ?? 0),
            path: page.file.path,
        };
    }

    getPeriods(path: string): PeriodDto[] {
        const periodPages = this.reader
            .getPagesByPathAtDepthRel(path)
            .sort((page) => [page.order ?? page.file.folder])
            .filter((page) => page.file.name === 'index');

        return periodPages.map((page) => this.createPeriod(page)).array();
    }

    getPeriod(path: string): PeriodDto | undefined {
        const page = this.reader.getPage(path);

        if (!page) {
            return undefined;
        }

        return this.createPeriod(page);
    }

    // eslint-disable-next-line class-methods-use-this
    createPeriod(page: Record<string, any>): PeriodDto {
        const name = Budget.getName(page);

        return {
            name,
            title: page.title ?? name,
            value: parseFloat(page.value ?? 0),
            path: page.file.path,
        };
    }

    getCategories(path: string): CategoryDto[] {
        const categoryPages = this.reader
            .getPagesByPathAtDepthRel(path)
            .sort((page) => [page.order ?? page.file.folder])
            .filter((page) => page.file.name === 'index');

        return categoryPages
            .map((categoryPage) => this.createCategory(categoryPage))
            .array();
    }

    getCategory(path: string): CategoryDto | undefined {
        const page = this.reader.getPage(path);

        if (!page) {
            return undefined;
        }

        return this.createCategory(page);
    }

    createCategory(page: Record<string, any>): CategoryDto {
        let plan = 0;
        let fact = 0;

        const categories = this.getCategories(page.file.path);

        for (const category of categories) {
            plan += category.total.plan;
            fact += category.total.fact;
        }

        const transactions = this.getTransactions(page.file.path);

        for (const transaction of transactions) {
            if (transaction.type === 'plan') {
                plan += transaction.value;
            } else {
                fact += transaction.value;
            }
        }

        const name = Budget.getName(page);

        return {
            name,
            title: page.title ?? name,
            icon: page.icon,
            value: parseFloat(page.value ?? 0),
            categories,
            total: { plan, fact },
            dir: page.dir === 'in' ? 'in' : 'out',
            path: page.file.path,
            folder: page.file.folder,
        };
    }

    getTransactions(path: string, recursive = false): TransactionDto[] {
        const pages = (
            recursive
                ? this.reader.getPagesByPath(path)
                : this.reader.getPagesByPathAtDepthRel(path)
        )
            .filter((page) => page.file.name !== 'index')
            .sort((page) => page.file.ctime, 'desc');

        return pages.map((page) => this.createTransaction(page)).array();
    }

    getTransaction(path: string): TransactionDto | undefined {
        const page = this.reader.getPage(path);

        if (!page) {
            return undefined;
        }

        return this.createTransaction(page);
    }

    // eslint-disable-next-line class-methods-use-this
    createTransaction(page: Record<string, any>): TransactionDto {
        const name = Budget.getName(page);

        return {
            name,
            title: page.title ?? name,
            value: parseFloat(page.value ?? 0),
            type: page.type === 'plan' ? 'plan' : 'fact',
            path: page.file.path,
            date: page.date ? new Date(page.date) : page.file.ctime.toJSDate(),
        };
    }

    createTransactionPage(path: string, transaction: TransactionCreateDto) {
        const filePath = `${path}/${transaction.date.getTime()}.md`;

        const content = `\`\`\`\n${SBS_BUDGET_TRANSACTION}\n\`\`\``;

        return this.writer.createPage(filePath, transaction, content);
    }

    protected static getName(page: Record<string, any>): string {
        if (page.name) {
            return page.name;
        }

        if (page.file) {
            if (page.file.name && page.file.name !== 'index') {
                return page.file.name;
            }

            if (page.file.folder) {
                return page.file.folder.split('/').slice(-1)[0] ?? '';
            }
        }

        return '';
    }
}
